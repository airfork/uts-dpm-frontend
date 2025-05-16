import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import GetUserDetailDto from '../../models/get-user-detail-dto';
import { first } from 'rxjs';
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
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { NgClass, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserFormComponent } from '../user-form/user-form.component';
import { ConfirmBoxComponent } from '../../ui/confirm-box/confirm-box.component';
import { BlockPipe } from '../../shared/pipes/BlockPipe';
import { PointsPipe } from '../../shared/pipes/PointsPipe';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  imports: [
    NgClass,
    TableModule,
    FormsModule,
    UpperCasePipe,
    UserFormComponent,
    ConfirmBoxComponent,
    BlockPipe,
    PointsPipe,
    LoadingComponent,
    Ripple,
  ],
})
export class UserDetailComponent implements OnInit {
  private lastLazyLoadEvent?: TableLazyLoadEvent;

  userId = signal('');
  loadingDpms = signal(true);
  totalRecords = signal(0);
  activeTab = signal({ info: true, dpms: false, actions: false });
  user = signal<GetUserDetailDto | null>(null);
  currentDpm = signal<DpmDetailDto | null>(null);
  dpms = signal<DpmDetailDto[]>([]);
  confirmModalOpen = signal(false);
  modalMessage = signal('');
  outputKey = signal<DetailOutputKey>('email');
  @ViewChild('dpmModal') dpmModalElement!: ElementRef<HTMLDialogElement>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private titleService: Title,
    private notificationService: NotificationService,
    private dpmService: DpmService,
    private approvalsService: ApprovalsService,
    private authService: AuthService
  ) {}

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

  clickRow(dpm: DpmDetailDto) {
    this.currentDpm.set(dpm);
    this.showModalInternal();
  }

  denyDpm() {
    this.closeModalInternal();
    const currentDpm = this.currentDpm();
    if (!currentDpm) return;

    this.approvalsService
      .denyDpm(currentDpm.id)
      .pipe(first())
      .subscribe(() => {
        this.notificationService.showSuccess('DPM has been denied', 'Success');
        this.lazyLoadEvent(this.lastLazyLoadEvent!);
      });
  }

  activateTab(tab: DetailTab) {
    switch (tab) {
      case 'detail-actions':
        this.saveTabInUrl(tab);
        this.activeTab.set({ info: false, dpms: false, actions: true });
        break;
      case 'dpms':
        this.saveTabInUrl(tab);
        this.activeTab.set({ info: false, dpms: true, actions: false });
        break;
      case 'info':
        this.saveTabInUrl(tab);
        this.activeTab.set({ info: true, dpms: false, actions: false });
        break;
      default:
        console.error(`Unknown tab: ${tab}`);
    }
  }

  lazyLoadEvent(event: TableLazyLoadEvent) {
    this.lastLazyLoadEvent = event;
    this.loadingDpms.set(true);
    let size = 10;
    if (event.rows) size = event.rows;

    let page = 0;
    if (event.first) {
      page = event.first / size;
    }

    this.dpmService
      .getAllForUser(this.userId(), page, size)
      .pipe(first())
      .subscribe((page) => {
        this.dpms.set(page.content);
        this.totalRecords.set(page.totalElements);
        this.loadingDpms.set(false);
      });
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

  showModalInternal() {
    if (this.dpmModalElement && this.dpmModalElement.nativeElement) {
      this.dpmModalElement.nativeElement.showModal();
    }
  }

  closeModalInternal() {
    if (this.dpmModalElement && this.dpmModalElement.nativeElement) {
      this.dpmModalElement.nativeElement.close();
    }
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
