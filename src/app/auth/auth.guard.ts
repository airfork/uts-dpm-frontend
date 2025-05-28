import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Roles } from './roles.types';
import { AuthService } from '../services/auth.service';

export const hasPermissions = (allowedRoles: Roles[], url: string): boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    if (url.includes('/login')) {
      router.navigate(['/']);
      return false;
    }

    if (allowedRoles.includes(authService.userData.role as Roles)) {
      return true;
    }

    router.navigate(['/errors/403']);
    return false;
  }

  if (url.includes('/login')) return true;
  router.navigate(['/login']);
  return false;
};

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return hasPermissions(route.data['allowedRoles'], state.url);
};

export const authChildGuard: CanActivateChildFn = (
  childRoute: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return hasPermissions(childRoute.data['allowedRoles'], state.url);
};
