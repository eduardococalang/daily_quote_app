import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { WordOfDayComponent } from './components/word-of-day/word-of-day.component';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter([
    {
      path: '',
      component:WordOfDayComponent
    }
  ])]
};
