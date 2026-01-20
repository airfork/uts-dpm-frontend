import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { Location, NgClass, UpperCasePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import GetUserDetailDto from '../../models/get-user-detail-dto';
import { first, catchError, of } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { NotificationService } from '../../services/notification.service';
import DpmDetailDto from '../../models/dpm-detail-dto';
import { DpmService } from '../../services/dpm.service';
import { ApprovalsService } from '../../services/approvals.service';
import { UserService } from '../../services/user.service';
import { DetailTab } from '../shared/tab.types';
import {
  DETAIL_DELETE_MESSAGE,
  DETAIL_EMAIL_MESSAGE,
  DETAIL_RESET_MESSAGE,
  DetailOutputKey,
} from '../shared/confirm-box-info';
import { AuthService } from '../../services/auth.service';
import { DataTableComponent } from '../../ui/data-table/data-table.component';
import { TableColumn, LazyLoadEvent } from '../../ui/data-table/data-table.types';
import { FormsModule } from '@angular/forms';
import { UserFormComponent } from '../user-form/user-form.component';
import { ConfirmBoxComponent } from '../../ui/confirm-box/confirm-box.component';
import { BlockPipe } from '../../shared/pipes/BlockPipe';
import { PointsPipe } from '../../shared/pipes/PointsPipe';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { PageHeaderComponent } from '../../ui/page-header/page-header.component';
import { EmptyStateComponent } from '../../ui/empty-state/empty-state.component';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
  imports: [
    FormsModule,
    NgClass,
    UpperCasePipe,
    UserFormComponent,
    ConfirmBoxComponent,
    BlockPipe,
    PointsPipe,
    LoadingComponent,
    DataTableComponent,
    PageHeaderComponent,
    EmptyStateComponent,
  ],
})
export class UserDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private userService = inject(UserService);
  private titleService = inject(Title);
  private notificationService = inject(NotificationService);
  private dpmService = inject(DpmService);
  private approvalsService = inject(ApprovalsService);
  private authService = inject(AuthService);

  private lastLazyLoadEvent?: LazyLoadEvent;
  private readonly PAGE_SIZE = 10;

  userId = signal('');
  isInitialLoad = signal(true);

  columns: TableColumn<DpmDetailDto>[] = [
    { field: 'type', header: 'Type' },
    { field: 'date', header: 'Date' },
    { field: 'status', header: 'Status' },
  ];
  loadingDpms = signal(false);
  totalRecords = signal(0);
  activeTabName = signal<string>('info');
  activeTabIndex = signal(0);

  // Pagination computed signals
  currentPage = computed(() => {
    if (!this.lastLazyLoadEvent) return 0;
    return Math.floor(this.lastLazyLoadEvent.first / this.lastLazyLoadEvent.rows);
  });
  totalPages = computed(() => Math.ceil(this.totalRecords() / this.PAGE_SIZE));

  user = signal<GetUserDetailDto | null>(null);
  dpms = signal<DpmDetailDto[]>([]);
  confirmModalOpen = signal(false);
  modalMessage = signal('');
  outputKey = signal<DetailOutputKey>('email');

  // Expandable row state
  expandedDpmId = signal<number | null>(null);

  ngOnInit() {
    this.route.params.pipe(first()).subscribe((value) => {
      const { id } = value as { id: string };
      this.userService
        .getUser(id)
        .pipe(first())
        .subscribe((user) => {
          this.user.set(user);
          this.setTitle();
          this.userId.set(id);
        });
    });

    // jump to tab based on query param
    this.route.queryParamMap.pipe(first()).subscribe((value) => {
      const tab = value.get('tab') as DetailTab;
      if (tab) this.activateTab(tab);
    });
  }

  toggleExpand(dpm: DpmDetailDto) {
    if (this.expandedDpmId() === dpm.id) {
      this.expandedDpmId.set(null);
    } else {
      this.expandedDpmId.set(dpm.id);
    }
  }

  isExpanded(dpm: DpmDetailDto): boolean {
    return this.expandedDpmId() === dpm.id;
  }

  denyDpm(dpm: DpmDetailDto, event: Event) {
    event.stopPropagation();
    this.expandedDpmId.set(null);

    this.approvalsService
      .denyDpm(dpm.id)
      .pipe(first())
      .subscribe(() => {
        this.notificationService.showSuccess('DPM has been denied', 'Success');
        this.lazyLoadEvent(this.lastLazyLoadEvent!);
      });
  }

  activateTab(tab: DetailTab | string) {
    this.activeTabName.set(tab);
    this.saveTabInUrl(tab as DetailTab);

    const tabs = ['info', 'dpms', 'detail-actions'];
    const tabIndex = tabs.indexOf(tab);
    if (tabIndex !== -1) {
      this.onTabChange(tabIndex);
    }
  }

  onTabChange(index: number): void {
    this.activeTabIndex.set(index);

    if (index === 1 && this.dpms().length === 0 && !this.loadingDpms()) {
      this.lazyLoadEvent({ first: 0, rows: 10 });
    }
  }

  lazyLoadEvent(event: LazyLoadEvent) {
    this.lastLazyLoadEvent = event;
    this.loadingDpms.set(true);
    const size = event.rows;
    const page = event.first / size;

    this.dpmService
      .getAllForUser(this.userId(), page, size)
      .pipe(
        first(),
        catchError(() => {
          this.loadingDpms.set(false);
          this.notificationService.showError('Failed to load DPMs');
          return of({ content: [], totalElements: 0 });
        })
      )
      .subscribe((pageData) => {
        this.dpms.set(pageData.content);
        this.totalRecords.set(pageData.totalElements);
        this.loadingDpms.set(false);
        // Disable initial load animation after first data load
        setTimeout(() => this.isInitialLoad.set(false), 500);
      });
  }

  // Mobile pagination methods
  goToNextPage() {
    if (this.currentPage() < this.totalPages() - 1) {
      this.isInitialLoad.set(true);
      this.lazyLoadEvent({
        first: (this.currentPage() + 1) * this.PAGE_SIZE,
        rows: this.PAGE_SIZE,
      });
    }
  }

  goToPrevPage() {
    if (this.currentPage() > 0) {
      this.isInitialLoad.set(true);
      this.lazyLoadEvent({
        first: (this.currentPage() - 1) * this.PAGE_SIZE,
        rows: this.PAGE_SIZE,
      });
    }
  }

  handleConfirmEvent($event: string) {
    switch ($event as DetailOutputKey) {
      case 'delete':
        this.deleteUser();
        break;
      case 'email':
        this.sendPointsBalanceEmail();
        break;
      case 'reset':
        this.resetPassword();
        break;
      default:
        console.warn('Unknown user detail output key: ' + $event);
    }
  }

  deleteUserClick() {
    // shouldn't happen, but just in case
    if (this.viewingSelf()) {
      this.notificationService.showWarning("You can't delete yourself -_-");
      return;
    }
    this.modalMessage.set(DETAIL_DELETE_MESSAGE);
    this.outputKey.set('delete');
    this.confirmModalOpen.set(true);
  }

  sendEmailClick() {
    this.modalMessage.set(DETAIL_EMAIL_MESSAGE);
    this.outputKey.set('email');
    this.confirmModalOpen.set(true);
  }

  resetClick() {
    this.modalMessage.set(DETAIL_RESET_MESSAGE);
    this.outputKey.set('reset');
    this.confirmModalOpen.set(true);
  }

  viewingSelf(): boolean {
    const user = this.user();
    if (!user) return false;

    return (
      this.authService.userData.username.toLowerCase().trim() === user.email.toLowerCase().trim()
    );
  }

  goBack(): void {
    this.location.back();
  }

  private setTitle() {
    const user = this.user();
    if (!user) return;
    this.titleService.setTitle(
      `${this.titleService.getTitle()} (${user.firstname} ${user.lastname})`
    );
  }

  private saveTabInUrl(tab: DetailTab) {
    // update query param to save tab state
    // need to set title in callback as it gets reset
    this.router
      .navigate(['.'], {
        relativeTo: this.route,
        queryParams: { tab },
        replaceUrl: true,
      })
      .then(() => this.setTitle());
  }

  private deleteUser() {
    this.userService
      .deleteUser(this.userId())
      .pipe(first())
      .subscribe(() => {
        this.router
          .navigate(['/users'])
          .then(() => this.notificationService.showSuccess('User has been deleted'));
      });
  }

  private sendPointsBalanceEmail() {
    this.userService
      .sendPointsBalance(this.userId())
      .pipe(first())
      .subscribe(() => this.notificationService.showSuccess('Email sent'));
  }

  private resetPassword() {
    this.userService
      .resetPassword(this.userId())
      .pipe(first())
      .subscribe(() => this.notificationService.showSuccess("User's password has been reset"));
  }
}
