import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';

import { GlobalErrorHandlerService } from './@compartidos/services/global-error-handler.service';
import { NucleoModule } from './@nucleo/nucleo.module';
import { NucleoComponent } from './@nucleo/nucleo.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

@NgModule({
  declarations: [],
  imports: [BrowserModule, BrowserAnimationsModule, NucleoModule],
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ],
  bootstrap: [NucleoComponent]
})
export class AppModule {}
