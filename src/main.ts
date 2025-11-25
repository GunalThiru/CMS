import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';
import { provideHttpClient } from '@angular/common/http'; // ✅ add this

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    provideHttpClient()  // ✅ provide HttpClient globally
  ]
}).catch(err => console.error(err));
