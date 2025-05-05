import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
