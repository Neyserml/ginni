import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TooltipModule } from 'ng2-tooltip-directive';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { ValidacionDatosComponent } from 'app/modulos/reactivaciones/detalle-resueltos/generacion-contrato/componentes/validacion-datos/validacion-datos.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from 'app/modulos/reactivaciones/detalle-resueltos/generacion-contrato/componentes/validacion-datos/@store';
import { EffectsModule } from '@ngrx/effects';
import { ValidarDatosEffect } from 'app/modulos/reactivaciones/detalle-resueltos/generacion-contrato/componentes/validacion-datos/@store/validar-datos.effect';
import { ValidacionDatosService } from 'app/modulos/reactivaciones/detalle-resueltos/generacion-contrato/componentes/validacion-datos/validacion.service';
import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';
import { ValidarDatosResolve } from 'app/modulos/reactivaciones/detalle-resueltos/generacion-contrato/componentes/validacion-datos/@guards/validar-datos.resolve';
import { ConfiguracionResponseResolve } from 'app/modulos/portal/@guards/configuracion-response.resolve';
import { LocalidadesResolve } from 'app/modulos/portal/@guards/localidades.resolve';
import { InformacionPersonalComponent } from './@componentes/informacion-personal/informacion-personal.component';

const routes: Routes = [
  {
    path: '',
    resolve: {
      datosCabecera: ValidarDatosResolve,
      configuracion: ConfiguracionResponseResolve,
      localidades: LocalidadesResolve
    },
    component: ValidacionDatosComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CompartidosModule,
    StoreModule.forFeature('validacionDatos', reducers),
    EffectsModule.forFeature([ValidarDatosEffect]),
    RouterModule.forChild(routes),
    TooltipModule
  ],
  declarations: [ValidacionDatosComponent, InformacionPersonalComponent],
  providers: [
    providersHttpInterceptors,
    ValidacionDatosService,
    ValidarDatosResolve,
    ConfiguracionResponseResolve,
    LocalidadesResolve
  ]
})
export class ValidacionDatosModule {}
