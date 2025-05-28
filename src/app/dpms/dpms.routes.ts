import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GenerateTitle, TitlePrefix } from '../shared/title-helper';
import { authGuard } from '../auth/auth.guard';
import { AutogenComponent } from './autogen/autogen.component';
import { DatagenComponent } from './datagen/datagen.component';
import { ApprovalsComponent } from './approvals/approvals.component';
import { DpmsComponent } from './dpms/dpms.component';
import { DpmPageComponent } from './dpm-page/dpm-page.component';

export const DPM_ROUTES: Route[] = [
  {
    path: '',
    component: DpmsComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        title: TitlePrefix,
        canActivate: [authGuard],
        data: {
          allowedRoles: ['ADMIN', 'ANALYST', 'DRIVER', 'MANAGER', 'SUPERVISOR'],
        },
      },
      {
        path: 'dpm',
        component: DpmPageComponent,
        canActivate: [authGuard],
        data: {
          allowedRoles: ['ADMIN', 'ANALYST', 'MANAGER', 'SUPERVISOR'],
        },
      },
      {
        path: 'autogen',
        component: AutogenComponent,
        title: GenerateTitle('Autogenerate DPMs'),
        canActivate: [authGuard],
        data: {
          allowedRoles: ['ADMIN', 'ANALYST', 'MANAGER', 'SUPERVISOR'],
        },
      },
      {
        path: 'datagen',
        component: DatagenComponent,
        title: GenerateTitle('Generate Data'),
        canActivate: [authGuard],
        data: {
          allowedRoles: ['ADMIN', 'ANALYST', 'MANAGER'],
        },
      },
      {
        path: 'approvals',
        component: ApprovalsComponent,
        title: GenerateTitle('Approvals'),
        canActivate: [authGuard],
        data: {
          allowedRoles: ['ADMIN', 'MANAGER'],
        },
      },
    ],
  },
];
