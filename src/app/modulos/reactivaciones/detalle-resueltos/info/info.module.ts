import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { InfoComponent } from './info.container';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';

const routes: Routes = [
  {
    path: '',
    component: InfoComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    CompartidosModule.forRoot()
  ],
  declarations: [InfoComponent]
})
export class InfoModule {}
