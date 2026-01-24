import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  signal,
  inject,
  ViewChild,
} from '@angular/core';
import { UserService } from '../../services/user.service';
import UsernameDto from '../../models/username-dto';
import { FormatService } from '../../services/format.service';
import { first } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ListTab } from '../shared/tab.types';
import { LIST_EMAIL_MESSAGE, LIST_RESET_MESSAGE, ListOutputKey } from '../shared/confirm-box-info';
import { NotificationService } from '../../services/notification.service';
import { UserFormComponent } from '../user-form/user-form.component';
import { ConfirmBoxComponent } from '../../ui/confirm-box/confirm-box.component';
import { NamePipe } from '../../shared/pipes/NamePipe';
import { DataTableComponent } from '../../ui/data-table/data-table.component';
import { TableColumn } from '../../ui/data-table/data-table.types';
import { PageHeaderComponent } from '../../ui/page-header/page-header.component';
import { EmptyStateComponent } from '../../ui/empty-state/empty-state.component';
import { NgClass } from '@angular/common';
import {
  SkeletonComponent,
  TableSkeletonComponent,
  CardSkeletonComponent,
} from '../../ui/skeleton';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    UserFormComponent,
    ConfirmBoxComponent,
    NamePipe,
    DataTableComponent,
    PageHeaderComponent,
    EmptyStateComponent,
    SkeletonComponent,
    TableSkeletonComponent,
    CardSkeletonComponent,
  ],
})
export class UsersListComponent implements OnInit {
  private userService = inject(UserService);
  private formatService = inject(FormatService);
  private notificationService = inject(NotificationService);
  private changeDetector = inject(ChangeDetectorRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @ViewChild(DataTableComponent) dataTable?: DataTableComponent<UsernameDto>;

  users = signal<UsernameDto[] | null>(null);
  filteredUsers = signal<UsernameDto[]>([]);
  activeTabName = signal<string>('search');
  isInitialLoad = signal(true);
  managers = signal<string[] | null>(null);
  modalOpen = signal(false);
  modalMessage = signal('');
  outputKey = signal<ListOutputKey>('email');

  // State preservation
  searchTerm = signal('');
  initialFirst = signal(0);
  private readonly PAGE_SIZE = 10;
  private isRestoringState = false;

  columns: TableColumn<UsernameDto>[] = [
    { field: 'name', header: 'Last Name' },
    { field: 'name', header: 'First Name' },
  ];

  ngOnInit() {
    // Restore state from query params
    this.isRestoringState = true;
    this.route.queryParamMap.pipe(first()).subscribe((value) => {
      const tab = value.get('tab') as ListTab;
      if (tab) {
        this.activeTabName.set(tab); // Set tab without triggering URL save

        // Load managers if restoring to create tab
        if (tab === 'create' && !this.managers()) {
          this.userService
            .getManagers()
            .pipe(first())
            .subscribe((managers) => {
              this.managers.set(managers);
              this.changeDetector.detectChanges();
            });
        }
      }

      // Restore search term
      const search = value.get('search');
      if (search) {
        this.searchTerm.set(search);
      }

      // Restore page
      const page = value.get('page');
      if (page) {
        const pageNum = parseInt(page, 10);
        if (!isNaN(pageNum) && pageNum > 0) {
          this.initialFirst.set((pageNum - 1) * this.PAGE_SIZE);
        }
      }

      this.isRestoringState = false;
    });

    this.userService
      .getUserNames()
      .pipe(first())
      .subscribe((users) => {
        this.users.set(users);
        // Apply search filter if we have a search term from URL
        const search = this.searchTerm();
        if (search) {
          this.filteredUsers.set(
            users.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))
          );
        } else {
          this.filteredUsers.set(users);
        }
        this.changeDetector.detectChanges();

        // Set initial page after data loads (needs timeout for view to update)
        const initialPage = this.initialFirst();
        if (initialPage > 0 && this.dataTable) {
          setTimeout(() => {
            this.dataTable?.goToPage(Math.floor(initialPage / this.PAGE_SIZE));
          });
        }

        // Disable initial load animation after first render
        setTimeout(() => this.isInitialLoad.set(false), 500);
      });
  }

  getInitials(name: string): string {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  activateTab(tab: ListTab | string) {
    this.activeTabName.set(tab);
    this.saveStateToUrl();

    // Load managers when switching to create tab
    if (tab === 'create' && !this.managers()) {
      this.userService
        .getManagers()
        .pipe(first())
        .subscribe((managers) => {
          this.managers.set(managers);
          this.changeDetector.detectChanges();
        });
    }
  }

  filterUsers($event: Event) {
    const users = this.users();
    if (!users) return;

    const target = $event.target as HTMLInputElement;
    const searchValue = target.value;
    this.searchTerm.set(searchValue);
    this.filteredUsers.set(
      users.filter((user) => user.name.toLowerCase().includes(searchValue.toLowerCase()))
    );

    // Reset to first page when searching and save state
    if (this.dataTable) {
      this.dataTable.goToPage(0);
    }
    this.saveStateToUrl();
  }

  clearSearch() {
    const users = this.users();
    if (!users) return;

    this.searchTerm.set('');
    this.filteredUsers.set(users);

    // Reset to first page and save state
    if (this.dataTable) {
      this.dataTable.goToPage(0);
    }
    this.saveStateToUrl();
  }

  onPageChange(event: { page: number; rows: number; first: number }) {
    this.saveStateToUrl(event.page + 1);
  }

  handlerUserClick(id: number) {
    this.router.navigate([`/users/${id}`]);
  }

  sendEmailClick() {
    this.outputKey.set('email');
    this.modalMessage.set(LIST_EMAIL_MESSAGE);
    this.modalOpen.set(true);
  }

  resetPointsClick() {
    this.outputKey.set('reset');
    this.modalMessage.set(LIST_RESET_MESSAGE);
    this.modalOpen.set(true);
  }

  handleConfirmEvent($event: string) {
    switch ($event as ListOutputKey) {
      case 'email':
        this.sendPointsBalanceAll();
        break;
      case 'reset':
        this.resetPointBalances();
        break;
      default:
        console.warn('Unknown user list output event: ' + $event);
    }
  }

  get format() {
    return this.formatService;
  }

  private resetPointBalances() {
    this.userService

      .resetPointBalances()
      .pipe(first())
      .subscribe(() =>
        this.notificationService.showSuccess('Part-timer point balances have been reset')
      );
  }

  private saveStateToUrl(page?: number) {
    // Skip URL updates during initial state restoration
    if (this.isRestoringState) return;

    const queryParams: Record<string, string | null> = {
      tab: this.activeTabName(),
    };

    // Only save search/page if on search tab
    if (this.activeTabName() === 'search') {
      const search = this.searchTerm();
      queryParams['search'] = search || null;

      // Use provided page or get from data table
      const currentPage = page ?? (this.dataTable ? this.dataTable.currentPage() + 1 : 1);
      queryParams['page'] = currentPage > 1 ? String(currentPage) : null;
    } else {
      // Clear search/page params when not on search tab
      queryParams['search'] = null;
      queryParams['page'] = null;
    }

    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private sendPointsBalanceAll() {
    this.userService
      .sendPointsBalanceAll()
      .pipe(first())
      .subscribe(() => this.notificationService.showSuccess('Emails have been queued'));
  }
}
