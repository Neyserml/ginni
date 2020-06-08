import { Observable } from 'rxjs/Observable';

export const EditarApiServiceStub = {
  tipoPersona: () => Observable.of({}),
  informacionPersonal: () => Observable.of({}),
  informacionAsociado: () => Observable.of({}),
  actualizarInformacionAsociado: () => Observable.of({}),
  informacionLaboral: () =>
    Observable.of({
      centroTrabajo: 'ADECO ESPAÑA',
      cargoOcupacion: {
        identificador: '103',
        descripcion: 'profesional en redes y comunicaciones'
      },
      idTipoTrabajador: 3651,
      fechaIngresoTrabajo: '20/07/1979',
      direccion: {
        idDepartamento: '15',
        idProvincia: '01',
        idDistrito: '01',
        idTipoZona: '82',
        nombreZona: 'corpac',
        idTipoVia: '95',
        direccionTexto: 'EMILIO FERRARI NIVEL 2 -P 4A',
        referencia: 'a pasos de larcomar'
      },
      contacto: {
        id: '12321321',
        numeroTelefono: '7996961',
        anexo: '038',
        correoElectronico: 'desarrollo@pandero.com.pe'
      },
      estadoPEP: true
    }),
  obtenerCargoOcupacion: () => Observable.of({}),
  actualizarInformacionLaboral: () => Observable.of({}),
  obtenerVinculacion: () => Observable.of({}),
  personasRelacionadas: () => Observable.of({}),
  eliminarPersonaRelacionada: () => Observable.of({}),
  obtenerPersonasRelacionadas: () => Observable.of({}),
  agregarPersonasRelacionadas: () => Observable.of({}),
  obtenerPersonasRelacionadaPorIdRelacion: () => Observable.of({}),
  actualizarPersonasRelacionadas: () => Observable.of({}),
  obtenerIngresos: () => Observable.of({}),
  registrarIngreso: () => Observable.of({}),
  actualizarIngreso: () => Observable.of({}),
  eliminarIngreso: () => Observable.of({})
};
