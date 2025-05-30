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
import { TableModule } from 'primeng/table';
import { AutoFocus } from 'primeng/autofocus';
import { NgClass } from '@angular/common';
import { ConfirmBoxComponent } from '../../ui/confirm-box/confirm-box.component';
import { NamePipe } from '../../shared/pipes/NamePipe';
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UserFormComponent,
    TableModule,
    AutoFocus,
    NgClass,
    ConfirmBoxComponent,
    NamePipe,
    LoadingComponent,
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
  activeTab = signal({ actions: false, create: false, search: true });
  managers = signal<string[] | null>(null);
  modalOpen = signal(false);
  modalMessage = signal('');
  outputKey = signal<ListOutputKey>('email');

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

  activateTab(tab: ListTab) {
    switch (tab) {
      case 'actions':
        this.saveTabInUrl(tab);
        this.activeTab.set({ actions: true, create: false, search: false });
        break;

      case 'create':
        this.saveTabInUrl(tab);
        if (!this.managers()) {
          this.userService
            .getManagers()
            .pipe(first())
            .subscribe((managers) => {
              this.managers.set(managers);
              this.changeDetector.detectChanges();
            });
        }
        this.activeTab.set({ actions: false, create: true, search: false });
        break;

      case 'search':
        this.saveTabInUrl(tab);
        this.activeTab.set({ actions: false, create: false, search: true });
        break;
      default:
        console.warn(`Unknown tab: ${tab}`);
        this.activeTab.set({ actions: false, create: false, search: true });
        this.clearQueryParams();
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
