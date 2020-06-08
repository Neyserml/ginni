import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MiEspacioComponent } from './mi-espacio.component';
import { MiEspacioApiService } from './mi-espacio-api.service';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';

const routes: Routes = [
  {
    path: '',
    component: MiEspacioComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), CompartidosModule.forRoot()],
  declarations: [MiEspacioComponent],
  providers: [MiEspacioApiService]
})
export class MiEspacioModule {}
