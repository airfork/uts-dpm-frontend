import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { authChildGuard } from '../auth/auth.guard';
import { UsersListComponent } from './users-list/users-list.component';
import { GenerateTitle } from '../shared/title-helper';
import { UserDetailComponent } from './user-detail/user-detail.component';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    component: UsersComponent,
    canActivateChild: [authChildGuard],
    data: {
      allowedRoles: ['ADMIN'],
    },
    children: [
      {
        path: '',
        component: UsersListComponent,
        title: GenerateTitle('Users'),
        data: {
          allowedRoles: ['ADMIN'],
        },
      },
      {
        path: ':id',
        component: UserDetailComponent,
        title: GenerateTitle('User Details'),
        data: {
          allowedRoles: ['ADMIN'],
        },
      },
    ],
  },
];
