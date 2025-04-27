import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { WordOfDayComponent } from './components/word-of-day/word-of-day.component';
import { SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';




export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter([
    {
      path: '',
      component:WordOfDayComponent
    }
  ]),
  
  {
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider('13188174802-8lbiqc0s1b1lfc5oknuthg993p4nf4fn.apps.googleusercontent.com')
        }
      ],
    } as SocialAuthServiceConfig,
  },
],
};
        
