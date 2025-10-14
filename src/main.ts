import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http'; // <-- Use this


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient() // <-- Use this instead of importProvidersFrom(HttpClientModule)

  ]
});
