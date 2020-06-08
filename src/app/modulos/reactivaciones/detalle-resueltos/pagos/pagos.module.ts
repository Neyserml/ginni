import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { PagosComponent } from './pagos.container';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';

const routes: Routes = [
  {
    path: '',
    component: PagosComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CompartidosModule.forRoot(),
    RouterModule.forChild(routes),
    CompartidosModule
  ],
  declarations: [PagosComponent]
})
export class PagosModule {}
