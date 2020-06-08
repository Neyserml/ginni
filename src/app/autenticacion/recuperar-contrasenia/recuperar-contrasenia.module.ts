import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { RecuperarContraseniaContainer } from './recuperar-contrasenia.container';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';

import { reducers } from './@store';
import { EnviarContraseniaEffect } from './@store/enviar-contrasenia.effect';

import { RecuperarContraseniaApiService } from './recuperar-contrasenia-api.service';
import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';

const routes: Routes = [
  {
    path: '',
    component: RecuperarContraseniaContainer
  }
];

@NgModule({
  imports: [
    CompartidosModule.forRoot(),
    StoreModule.forFeature('recuperarContrasenia', reducers),
    EffectsModule.forFeature([EnviarContraseniaEffect]),
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RecuperarContraseniaContainer],
  providers: [RecuperarContraseniaApiService, providersHttpInterceptors]
})
export class RecuperarContraseniaModule {}
