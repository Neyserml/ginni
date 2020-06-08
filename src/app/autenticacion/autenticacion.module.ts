import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Modules
import { CompartidosModule } from '../@compartidos/compartidos.module';
import { AutenticacionRoutingModule } from './autenticacion.routing';

import { InicioSesionContainer } from './inicio-sesion/inicio-sesion.container';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AutenticacionRoutingModule,
    CompartidosModule.forRoot()
  ],
  declarations: [InicioSesionContainer]
})
export class AutenticacionModule {}
