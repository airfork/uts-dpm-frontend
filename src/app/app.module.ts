import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DpmsModule } from './dpms/dpms.module';
import { ToastrModule } from 'ngx-toastr';
import { DpmsRoutingModule } from './dpms/dpms-routing.module';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { providePrimeNG } from 'primeng/config';

import { provideRouter, withComponentInputBinding } from '@angular/router';
import { AUTH_ROUTES } from './auth/auth.routes';
import { APP_ROUTES } from './app.routes';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    DpmsRoutingModule,
    DpmsModule,
    ToastrModule.forRoot({
      timeOut: 1000 * 3,
      positionClass: 'app-toast-top-center',
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideHttpClient(withInterceptorsFromDi()),
    providePrimeNG({ ripple: true }),
    provideRouter([...APP_ROUTES, ...AUTH_ROUTES], withComponentInputBinding()),
  ],
})
export class AppModule {}
