/*istanbul ignore next*/
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { DEFAULT_CONFIGURACION, PAGINAS_ROUTES } from './utils.stub';
import { reducers } from 'app/@compartidos/store';
import { CargandoComponent } from 'app/@compartidos/components/cargando/cargando.component';
import { GlobalEffect } from 'app/@compartidos/store/global.effect';
import { Configuracion } from 'app/modulos/portal/@models/configuracion.model';

export const declarationsRouterTest = [CargandoComponent];

// Instancia el StoreModule con el reducer por defecto de la aplicacion
export const StoreModuleForRootTest = StoreModule.forRoot({
  ...reducers
});

// Instancia el EffectsModule con el GlobalEffect por defecto de la aplicacion
export const EffectsModuleForRootTest = EffectsModule.forRoot([GlobalEffect]);

// Crea un router fake
export const RouterTestingModuleMockup = RouterTestingModule.withRoutes(PAGINAS_ROUTES);

export const CONFIGURACION_RESPONSE: Configuracion = new Configuracion(DEFAULT_CONFIGURACION);
