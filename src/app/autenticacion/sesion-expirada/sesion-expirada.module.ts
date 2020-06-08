import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SesionExpiradaComponent } from './sesion-expirada.component';
import { RouterModule, Routes } from '@angular/router';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';

const routes: Routes = [
  {
    path: '',
    component: SesionExpiradaComponent
  }
];

@NgModule({
  imports: [CommonModule, CompartidosModule.forRoot(), RouterModule.forChild(routes)],
  declarations: [SesionExpiradaComponent]
})
export class SesionExpiradaModule {}
