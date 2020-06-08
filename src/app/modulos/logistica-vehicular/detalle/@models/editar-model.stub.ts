import { tipoTelefono } from './personal.model';

export const EditarModelStub = {
  ingreso: {
    idIngreso: 123456,
    idOrigen: 'origin',
    readOnly: true,
    idTipoIngreso: 'principal',
    fuente: 'fuente',
    ingresoMensualNeto: {
      idMoneda: 'S/.',
      monto: 123
    }
  },
  response: {
    centroTrabajo: 'pandero',
    cargoOcupacion: {
      descripcion: 'description',
      identificador: 'id'
    },
    idTipoTrabajador: '123456',
    fechaIngresoTrabajo: '08/01/2018',
    direccion: {
      idDepartamento: 'department',
      idProvincia: 'province',
      idDistrito: 'district',
      idTipoZona: 'zone',
      nombreZona: 'nowhere',
      idTipoVia: 'way',
      direccionTexto: 'address',
      referencia: 'reference'
    },
    contacto: {
      idTelefono: 123456,
      numeroTelefono: 'phone',
      anexo: 'ext',
      correoElectronico: 'a@b.co'
    },
    estadoPEP: true,
    estadoUIF: false,
    estadoPLA: true,
    estadoAM: false
  },
  payload: {
    idPersona: '123456',
    laboral: {
      centroTrabajo: 'pandero',
      cargoOcupacion: {
        descripcion: 'description',
        identificador: 'id'
      },
      idTipoTrabajador: '123456',
      fechaIngresoTrabajo: '08/01/2018',
      direccion: {
        idDepartamento: 'department',
        idProvincia: 'province',
        idDistrito: 'district',
        idTipoZona: 'zone',
        nombreZona: 'nowhere',
        idTipoVia: 'way',
        direccionTexto: 'address',
        referencia: 'reference'
      },
      contacto: {
        idTelefono: 123456,
        numeroTelefono: 'phone',
        anexo: 'ext',
        correoElectronico: 'a@b.co'
      },
      estadoPEP: true,
      estadoUIF: false,
      estadoPLA: true,
      estadoAM: false
    },
    form: {
      estadoAM: true,
      estadoPLA: false,
      estadoUIF: true
    }
  },
  personaRelacionada: {
    idPersonaRelacionada: '',
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    idTipoRelacion: '',
    idEstadoCivil: '',
    idPaisNacionalidad: '',
    fechaNacimiento: '',
    idSexo: '',
    correo: '',
    celular: '',
    estadoPEP: false,
    aportaIngresos: false,
    direccionDomicilio: {
      idDepartamento: '',
      idProvincia: '',
      idDistrito: '',
      idTipoZona: '',
      nombreZona: '',
      idTipoVia: '',
      direccionTexto: '',
      referencia: ''
    },
    informacionLaboral: {
      idTipoTrabajador: '',
      centroTrabajo: '',
      cargoOcupacion: '',
      ingresoMensualNeto: '',
      fechaIngresoTrabajo: '',
      correoLaboral: ''
    }
  },
  informacionPersonalResponse: {
    nombreCompleto: '',
    tipoDocumento: '',
    numeroDocumento: '',
    numeroPartida: '',
    actividadEconomica: {
      identificador: '',
      descripcion: ''
    },
    giroNegocio: '',
    fechaConstitucion: '',
    correo: '',
    ruc: '',
    direccion: {
      idDepartamento: '',
      idProvincia: '',
      idDistrito: '',
      idTipoZona: null,
      nombreZona: '',
      idTipoVia: null,
      direccionTexto: '',
      referencia: ''
    },
    facturacionMensual: {
      idMoneda: null,
      monto: 123,
      idFacturacionMensual: 123456
    },
    telefonos: [
      {
        tipo: tipoTelefono.MOVIL,
        valor: '',
        id: 1,
        idAmbito: 2,
        anexo: ''
      }
    ],
    telefonosFijos: [
      {
        tipo: tipoTelefono.FIJO,
        valor: '',
        id: 1,
        idAmbito: 2,
        anexo: ''
      }
    ],
    celulares: [
      {
        tipo: tipoTelefono.MOVIL,
        valor: '',
        id: 1,
        idAmbito: 2,
        anexo: ''
      }
    ],
    separacionBienes: true,
    fechaNacimiento: '',
    idEstadoCivil: null,
    idSexo: null,
    idPaisNacionalidad: '',
    lugarNacimiento: {
      idPais: '',
      idDepartamento: '',
      idProvincia: '',
      idDistrito: ''
    },
    vinculados: [
      {
        idPersona: '',
        descripcion: '',
        idTipoRelacion: 456
      }
    ]
  }
};
