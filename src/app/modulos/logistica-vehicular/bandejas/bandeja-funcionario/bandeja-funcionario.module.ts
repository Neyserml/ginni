import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TooltipModule } from 'ng2-tooltip-directive';

import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';
import { metaReducers } from 'app/@compartidos/store/meta-reducer';
import { reducers } from './@store';
import { BandejaFuncionarioEffect } from './@store/bandeja-funcionario.effect';
import { BandejaFuncionarioContainer } from './bandeja-funcionario.container';
import { BandejaFuncionarioApiService } from './bandeja-funcionario-api.service';
import { DetalleApiService } from 'app/modulos/logistica-vehicular/detalle/detalle-api.service';

const routes: Routes = [
  {
    path: '',
    component: BandejaFuncionarioContainer
  },
  {
    path: 'detalle/:id',
    loadChildren: '../../detalle/detalle.module#DetalleLogisticaVehicularModule'
  }
];

@NgModule({
  imports: [
    TooltipModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('bandejaFuncionario', reducers, { metaReducers }),
    EffectsModule.forFeature([BandejaFuncionarioEffect]),
    CompartidosModule.forRoot()
  ],
  declarations: [BandejaFuncionarioContainer],
  providers: [BandejaFuncionarioApiService, DetalleApiService, providersHttpInterceptors]
})
export class BandejaFuncionarioModule {}
