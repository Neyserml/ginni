import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { RouterModule, Routes } from '@angular/router';
import { EvaluacionCrediticiaComponent } from './evaluacion.component';
import { ListaDocumentosComponent } from './@components/lista-documentos/lista-documentos.component';
import { ListaContratosComponent } from './@components/lista-contratos/lista-contratos.component';
import { ModalListaDocumentosComponent } from './@components/modal-lista-documentos/modal-lista-documentos.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ListaVerificacionesComponent } from './@components/lista-verificaciones/lista-verificaciones.component';
import { ModalListaVerificacionesComponent } from './@components/modal-lista-verificaciones/modal-lista-verificaciones.component';
import { EvaluacionApiService } from './evaluacion-api.service';
import { StoreModule } from '@ngrx/store';
import { reducers } from './@store';
import { EffectsModule } from '@ngrx/effects';
import { EvaluacionCrediticiaEffect } from './@store/evaluacion.effect';
import { metaReducers } from 'app/@compartidos/store/meta-reducer';
import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';
import { AgregarGaranteComponent } from 'app/modulos/logistica-vehicular/detalle/evaluacion/@components/agregar-garante/agregar-garante.component';
import { InformacionGaranteComponent } from 'app/modulos/logistica-vehicular/detalle/evaluacion/@components/informacion-garante/informacion-garante.component';
import { DetalleComponentesModule } from 'app/modulos/logistica-vehicular/detalle/@componentes/detalle-componentes.module';
import { ModalListaContratosComponent } from './@components/modal-lista-contratos/modal-lista-contratos.component';
import { SeguimientoEvaluacionComponent } from './@components/seguimiento/seguimiento.component';
import { BandejaJefeNegociosApiService } from '../../bandejas/bandeja-jefe-negocios/bandeja-jefe-negocios-api.service';
import { EvaluacionFacadeService } from './evaluacion-facade.service';

const routes: Routes = [
  {
    path: '',
    component: EvaluacionCrediticiaComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DetalleComponentesModule,
    CompartidosModule.forRoot(),
    StoreModule.forFeature('evaluacion', reducers, { metaReducers }),
    EffectsModule.forFeature([EvaluacionCrediticiaEffect]),
    RouterModule.forChild(routes)
  ],
  declarations: [
    AgregarGaranteComponent,
    EvaluacionCrediticiaComponent,
    InformacionGaranteComponent,
    ListaDocumentosComponent,
    ListaContratosComponent,
    ListaVerificacionesComponent,
    ModalListaContratosComponent,
    ModalListaDocumentosComponent,
    ModalListaVerificacionesComponent,
    SeguimientoEvaluacionComponent
  ],
  providers: [
    EvaluacionApiService,
    EvaluacionFacadeService,
    providersHttpInterceptors,
    BandejaJefeNegociosApiService
  ]
})
export class EvaluacionCrediticiaModule {}
