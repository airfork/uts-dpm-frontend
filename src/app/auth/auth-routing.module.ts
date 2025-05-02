import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GenerateTitle } from '../shared/title-helper';
import { AuthComponent } from './auth/auth.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { authGuard } from './auth.guard';

const routes: Routes = [
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
