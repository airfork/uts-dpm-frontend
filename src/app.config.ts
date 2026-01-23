import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AUTH_ROUTES } from './app/auth/auth.routes';
import { DPM_ROUTES } from './app/dpms/dpms.routes';
import { APP_ROUTES } from './app/app.routes';
import { authInterceptor } from './app/auth/auth.interceptor.fn';

export const AppConfig: ApplicationConfig = {
  providers: [
    provideRouter([...AUTH_ROUTES, ...DPM_ROUTES, ...APP_ROUTES], withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-center',
      progressBar: true,
      progressAnimation: 'decreasing',
      closeButton: true,
      tapToDismiss: true,
      newestOnTop: true,
      preventDuplicates: false,
    }),
    provideAnimations(), // Required for Toastr animations
  ],
};
