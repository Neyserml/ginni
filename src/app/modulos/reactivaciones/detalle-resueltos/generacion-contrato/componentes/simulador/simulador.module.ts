import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SimuladorComponent } from './simulador.component';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: SimuladorComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    CompartidosModule.forRoot()
  ],
  declarations: [SimuladorComponent],
  exports: [SimuladorComponent],
  providers: []
})
export class SimuladorModule {}
