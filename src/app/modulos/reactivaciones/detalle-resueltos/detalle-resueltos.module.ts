import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';
import { DetalleResueltosService } from './detalle-resueltos.service';
import { DetalleResueltosRoutingModule } from './detalle-resueltos.routing';
import { DetalleComponent } from './detalle-resueltos.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    DetalleResueltosRoutingModule,
    CompartidosModule.forRoot()
  ],
  declarations: [DetalleComponent],
  providers: [DetalleResueltosService, providersHttpInterceptors]
})
export class DetalleModule {}
