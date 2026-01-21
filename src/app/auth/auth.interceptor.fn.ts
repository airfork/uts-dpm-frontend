import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isAuthenticated()) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${authService.userData.token}` },
    });
  }

  return next(req).pipe(
    tap({
      error: (error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          if (
            error.status === 401 &&
            !(req.url.includes('/api/auth/login') || req.url.includes('/api/auth/changePassword'))
          ) {
            console.log('Not authorized, redirecting to login page');
            router.navigate(['/login']);
          } else if (error.status === 303) {
            console.info('Password needs to be changed, redirecting');
            router.navigate(['/passwordChange']);
          }
        }
      },
    })
  );
};
