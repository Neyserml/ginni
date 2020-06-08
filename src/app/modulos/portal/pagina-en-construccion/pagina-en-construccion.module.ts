import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaginaEnConstruccionComponent } from './pagina-en-construccion.component';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';

const routes: Routes = [
  {
    path: '',
    component: PaginaEnConstruccionComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), CompartidosModule.forRoot()],
  declarations: [PaginaEnConstruccionComponent]
})
export class PaginaEnConstruccionModule {}
