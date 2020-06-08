import { Observable } from 'rxjs/Observable';

export const PortalApiServiceStub = {
  perfiles: () => Observable.of({}),
  usuario: () => Observable.of({}),
  paises: () => Observable.of([]),
  departamentos: () => Observable.of([]),
  provincias: () => Observable.of([]),
  distritos: () => Observable.of([]),
  configuracionGeneral: () => Observable.of({}),
  getComboProvincias: () => Observable.of([]),
  getComboDistritos: () => Observable.of([])
};
