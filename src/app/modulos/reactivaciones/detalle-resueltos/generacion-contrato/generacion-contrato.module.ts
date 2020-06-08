import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TooltipModule } from 'ng2-tooltip-directive';

import { GeneracionContratoContainer } from './generacion-contrato.container';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { RadioButtonComponent } from 'app/@compartidos/components/radio-button/radio-button.component';
import { RadioGroupComponent } from 'app/@compartidos/components/radio-button/radio-group.component';
import { GeneracionContratoService } from './generacion-contrato.service';

const routes: Routes = [
  {
    path: '',
    component: GeneracionContratoContainer,
    children: [
      {
        path: '',
        redirectTo: 'simulador'
      },
      {
        path: 'simulador',
        loadChildren: './componentes/simulador/simulador.module#SimuladorModule'
      },
      {
        path: 'validar-datos',
        loadChildren: './componentes/validacion-datos/validacion-datos.module#ValidacionDatosModule'
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CompartidosModule,
    RouterModule.forChild(routes),
    TooltipModule
  ],
  declarations: [GeneracionContratoContainer],
  providers: [RadioButtonComponent, RadioGroupComponent, GeneracionContratoService]
})
export class GeneracionContratoModule {}
