import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { JwtInterceptorService } from './services/auth/jwt-interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideClientHydration(), 
    provideHttpClient(),
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true}
  ]
};
