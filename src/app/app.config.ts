import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxSpinnerModule } from "ngx-spinner";
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import { headerInterceptor } from './core/interceptors/header-interceptor';
import { loadingInterceptor } from './core/interceptors/loading-interceptor';
import { successInterceptor } from './core/interceptors/success-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({scrollPositionRestoration:"top"}), withViewTransitions(),withHashLocation()),
    provideHttpClient(withFetch(), withInterceptors([headerInterceptor, errorInterceptor, successInterceptor, loadingInterceptor])),
    provideToastr(),
    importProvidersFrom(BrowserAnimationsModule, NgxSpinnerModule),
  ]
};

