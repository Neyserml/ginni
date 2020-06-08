import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

document.write(`
<script>
  window.GA_ID = '${environment.googleAnalyticsId}';
  window.dataLayer = window.dataLayer || [];

  function gtag() {
    dataLayer.push(arguments)
  };
  gtag('js', new Date());

  gtag('config', GA_ID, {
    'send_page_view': false,
    'cookie_expires': 2419200 // 28 days, in seconds
  });
</script>
`);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
