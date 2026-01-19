import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  signal,
  inject,
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
import { LoadingComponent } from '../../shared/loading/loading.component';
import { DataTableComponent } from '../../ui/data-table/data-table.component';
import { TableColumn } from '../../ui/data-table/data-table.types';
import { TabsComponent } from '../../ui/tabs/tabs.component';
import { Tab } from '../../ui/tabs/tabs.types';
import { PageHeaderComponent } from '../../ui/page-header/page-header.component';
import { EmptyStateComponent } from '../../ui/empty-state/empty-state.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UserFormComponent,
    ConfirmBoxComponent,
    NamePipe,
    LoadingComponent,
    DataTableComponent,
    TabsComponent,
    PageHeaderComponent,
    EmptyStateComponent,
  ],
})
export class UsersListComponent implements OnInit {
  private userService = inject(UserService);
  private formatService = inject(FormatService);
  private notificationService = inject(NotificationService);
  private changeDetector = inject(ChangeDetectorRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  users = signal<UsernameDto[] | null>(null);
  filteredUsers = signal<UsernameDto[]>([]);
  activeTabName = signal<string>('search');
  tabs: Tab[] = [
    { name: 'search', label: 'Search' },
    { name: 'create', label: 'Create' },
    { name: 'actions', label: 'Actions' },
  ];
  managers = signal<string[] | null>(null);
  modalOpen = signal(false);
  modalMessage = signal('');
  outputKey = signal<ListOutputKey>('email');

  columns: TableColumn<UsernameDto>[] = [
    { field: 'name', header: 'Last Name' },
    { field: 'name', header: 'First Name' },
  ];

  ngOnInit() {
    // jump to tab based on query param
    this.route.queryParamMap.pipe(first()).subscribe((value) => {
      const tab = value.get('tab') as ListTab;
      if (tab) this.activateTab(tab);
    });

    this.userService
      .getUserNames()
      .pipe(first())
      .subscribe((users) => {
        this.users.set(users);
        this.filteredUsers.set(users);
        this.changeDetector.detectChanges();
      });
  }

  activateTab(tab: ListTab | string) {
    this.activeTabName.set(tab);
    this.saveTabInUrl(tab as ListTab);

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
    this.filteredUsers.set(
      users.filter((user) => user.name.toLowerCase().includes(target.value.toLowerCase()))
    );
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

  private saveTabInUrl(tab: ListTab) {
    // update query param to save tab state
    // need to set title in callback as it gets reset
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: { tab },
      replaceUrl: true,
    });
  }

  private clearQueryParams() {
    this.router.navigate(['.'], {
      relativeTo: this.route,
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
