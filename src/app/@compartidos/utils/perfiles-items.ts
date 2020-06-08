import * as pathToRegexp from 'path-to-regexp';

export interface IMenuItem {
  nombre?: string;
  clave?: string;
  icono?: string;
  url?: string;
  submenu?: IMenuItem[];
}

export const MENU: IMenuItem[] = [
  {
    clave: 'bandejacelula',
    url: '/portal/bandeja-de-trabajo'
  },
  {
    clave: 'bandejaseguimientoevaluacion',
    url: '/portal/bandeja-de-trabajo-evaluacion'
  },
  {
    clave: 'bandejareactivaciones',
    url: '/portal/bandeja-de-reactivaciones'
  },
  {
    clave: 'bandejajefenegocios',
    url: '/portal/bandeja-de-trabajo-negocios'
  },
  {
    clave: 'simulador',
    url: '/portal/simulador'
  },
  {
    clave: 'miespacio',
    url: '/portal/mi-espacio'
  }
];

export interface IPaginaItem extends IMenuItem {
  regex: RegExp;
}

export const PAGINAS: IPaginaItem[] = [
  ...MENU.map(pagina => ({
    ...pagina,
    regex: pathToRegexp(pagina.url)
  })),
  /**
   * Indica el nombre de la página en la que el usuario se encuentra
   * Ejm: Editar Asociado | Ginni
   */
  {
    clave: 'editar-asociado',
    nombre: 'Editar Asociado',
    regex: pathToRegexp('/portal/bandeja-de-trabajo/detalle/:id/editar/:id')
  },
  {
    clave: 'detalle',
    nombre: 'Detalle',
    regex: pathToRegexp('/portal/bandeja-de-trabajo/detalle/:id/evaluacion/crediticia')
  },
  {
    clave: 'detalle',
    nombre: 'Ingreso al caso',
    regex: pathToRegexp('/portal/bandeja-de-reactivaciones/detalle/:id/:param')
  }
];
