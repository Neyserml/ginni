import { Routes } from '@angular/router';
import { CargandoComponent } from '../app/@compartidos/components/cargando/cargando.component';
import { SesionResponsePayload } from '../app/@compartidos/models/sesion.model';
import { IConfiguracion } from '../app/modulos/portal/@models/configuracion.model';

export const PAGINAS_ROUTES: Routes = [
  { path: '', component: CargandoComponent },
  { path: 'inicio-sesion', component: CargandoComponent },
  { path: 'portal', component: CargandoComponent },
  { path: 'portal/mi-espacio', component: CargandoComponent },
  { path: 'portal/bandeja-de-trabajo', component: CargandoComponent },
  { path: 'portal/bandeja-de-reactivaciones', component: CargandoComponent },
  { path: 'portal/bandeja-de-trabajo-asistente-legal', component: CargandoComponent },
  { path: 'portal/bandeja', component: CargandoComponent },
  {
    path: 'portal/bandeja/detalle',
    component: CargandoComponent
  },
  {
    path: 'portal/bandeja/detalle/info',
    component: CargandoComponent
  },
  {
    path: 'portal/bandeja/detalle/simulador',
    component: CargandoComponent
  }
];

export const TOKEN = 'token';

export const SESION_RESPONSE: SesionResponsePayload = {
  token: TOKEN,
  vidaToken: 100,
  refreshToken: TOKEN,
  fechaActual: null
};

export const DEFAULT_CONFIGURACION: IConfiguracion = {
  estadoCivil: [
    {
      clave: '01',
      valor: 'F'
    }
  ],
  ingresoEconomico: [
    {
      clave: '01',
      valor: 'F'
    }
  ],
  origenIngreso: [],
  sexo: [
    {
      clave: '01',
      valor: 'F'
    }
  ],
  tipoCambio: 5,
  tipoDocumentos: [
    {
      clave: '01',
      valor: 'F'
    }
  ],
  tipoMoneda: [],
  tipoRelacion: [
    {
      clave: '01',
      valor: 'F'
    }
  ],
  tipoRelacionJuridico: [
    {
      clave: '01',
      valor: 'F'
    }
  ],
  tipoRelacionVinculado: [
    {
      clave: '01',
      valor: 'F'
    }
  ],
  tipoTrabajador: [
    {
      valor: 'Dependiente',
      clave: '3649'
    },
    {
      valor: 'Independiente',
      clave: '3650'
    },
    {
      valor: 'No Remunerado',
      clave: '3651'
    }
  ],
  tipoZona: [
    {
      clave: '01',
      valor: 'F'
    }
  ],
  tipoVia: [
    {
      clave: '01',
      valor: 'F'
    }
  ]
};
