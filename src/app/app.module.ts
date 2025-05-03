import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DpmsModule } from './dpms/dpms.module';
import { ToastrModule } from 'ngx-toastr';
import { DpmsRoutingModule } from './dpms/dpms-routing.module';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { AuthModule } from './auth/auth.module';
import { AuthInterceptor } from './auth/auth.interceptor';
import { providePrimeNG } from 'primeng/config';
import Material from '@primeng/themes/material';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AuthRoutingModule,
    DpmsRoutingModule,
    AppRoutingModule,
    AuthModule,
    DpmsModule,
    ToastrModule.forRoot({
      timeOut: 1000 * 3,
      positionClass: 'app-toast-top-center',
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideHttpClient(withInterceptorsFromDi()),
    providePrimeNG({ ripple: true, theme: { preset: Material } }),
  ],
})
export class AppModule {}
