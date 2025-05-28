import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppConfig } from './app.config';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, AppConfig).catch((err) => console.error(err));
