import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NotifierModule } from 'angular-notifier';

// Operators
import './operadores-rxjs';

// Modules
import { NucleoRoutingModule } from './nucleo.routing';
import { AutenticacionModule } from 'app/autenticacion/autenticacion.module';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';

// Store
import { reducers } from 'app/@compartidos/store';

// Effects
import { GlobalEffect } from 'app/@compartidos/store/global.effect';

// Enviroment
import { environment } from 'environments/environment';

import { NucleoComponent } from './nucleo.component';
import { InicioSesionApiService } from 'app/autenticacion/inicio-sesion/inicio-sesion-api.service';
import { TokenInterceptorService } from 'app/@compartidos/services/token-interceptor.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CatchInterceptorService } from 'app/@compartidos/services/catch-interceptor.service';
import { AnalyticsService } from './analytics.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([GlobalEffect]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    AutenticacionModule,
    NucleoRoutingModule,
    CompartidosModule.forRoot(),
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: 'right',
          distance: 12
        },
        vertical: {
          position: 'bottom',
          distance: 12,
          gap: 10
        }
      }
    })
  ],
  declarations: [NucleoComponent],
  exports: [NucleoComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CatchInterceptorService,
      multi: true
    },
    AnalyticsService,
    InicioSesionApiService
  ]
})
export class NucleoModule {}
