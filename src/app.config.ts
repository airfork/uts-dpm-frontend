import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AUTH_ROUTES } from './app/auth/auth.routes';
import { DPM_ROUTES } from './app/dpms/dpms.routes';
import { APP_ROUTES } from './app/app.routes';
import { AuthInterceptor } from './app/auth/auth.interceptor';

export const AppConfig: ApplicationConfig = {
  providers: [
    provideRouter([...AUTH_ROUTES, ...DPM_ROUTES, ...APP_ROUTES], withComponentInputBinding()),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    providePrimeNG({
      ripple: true,
      theme: {
        options: {
          prefix: 'p',
          darkModeSelector: 'system',
          cssLayer: true,
        },
      },
    }),
    provideToastr({
      timeOut: 1000 * 3,
      positionClass: 'app-toast-top-center',
    }),
    provideAnimations(), // Required for Toastr animations
  ],
};
