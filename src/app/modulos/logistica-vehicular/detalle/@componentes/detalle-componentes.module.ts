import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformacionPersonalComponent } from 'app/modulos/logistica-vehicular/detalle/@componentes/informacion-personal/informacion-personal.component';
import { InformacionLaboralComponent } from 'app/modulos/logistica-vehicular/detalle/@componentes/informacion-laboral/informacion-laboral.component';
import { PersonasRelacionadasComponent } from 'app/modulos/logistica-vehicular/detalle/@componentes/personas-relacionadas/personas-relacionadas.component';
import { IngresosComponent } from 'app/modulos/logistica-vehicular/detalle/@componentes/ingresos/ingresos.component';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, CompartidosModule.forRoot()],
  declarations: [
    InformacionPersonalComponent,
    InformacionLaboralComponent,
    PersonasRelacionadasComponent,
    IngresosComponent
  ],
  exports: [
    InformacionPersonalComponent,
    InformacionLaboralComponent,
    PersonasRelacionadasComponent,
    IngresosComponent
  ],
  providers: []
})
export class DetalleComponentesModule {}
