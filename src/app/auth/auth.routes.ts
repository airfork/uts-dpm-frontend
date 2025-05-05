import { Route } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './login/login.component';
import { GenerateTitle } from '../shared/title-helper';
import { authGuard } from './auth.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';

export const AUTH_ROUTES: Route[] = [
  {
    path: 'login',
    component: AuthComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
        title: GenerateTitle('Login'),
        canActivate: [authGuard],
        data: {
          allowedRoles: ['ADMIN', 'ANALYST', 'DRIVER', 'MANAGER', 'SUPERVISOR'],
        },
      },
    ],
  },
  {
    path: 'passwordChange',
    component: AuthComponent,
    children: [
      {
        path: '',
        component: ChangePasswordComponent,
        title: GenerateTitle('Change Password'),
        canActivate: [authGuard],
        data: {
          allowedRoles: ['ADMIN', 'ANALYST', 'DRIVER', 'MANAGER', 'SUPERVISOR'],
        },
      },
    ],
  },
];
