import { Route } from '@angular/router';

export const APP_ROUTES: Route[] = [
  {
    path: 'users',
    loadChildren: () => import('./users/users.routes').then((m) => m.USERS_ROUTES),
  },
  {
    path: 'errors',
    loadChildren: () =>
      import('./error-pages/error-pages.routes').then((m) => m.ERROR_PAGES_ROUTES),
  },
  {
    path: '**',
    redirectTo: '/errors/404',
  },
];
