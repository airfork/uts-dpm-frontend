import { Routes } from '@angular/router';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { GenerateTitle } from '../shared/title-helper';
import { NotFoundComponent } from './not-found/not-found.component';

export const ERROR_PAGES_ROUTES: Routes = [
  {
    path: '403',
    component: ForbiddenComponent,
    title: GenerateTitle('403'),
  },
  {
    path: '404',
    component: NotFoundComponent,
    title: GenerateTitle('404'),
  },
];
