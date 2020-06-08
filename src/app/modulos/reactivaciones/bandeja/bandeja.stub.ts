import {
  CarteraGeneralContrato,
  CarteraGeneralResponse,
  ICarteraGeneralItemResponsive,
  IReactivacionItemResponsive
} from './@models/bandeja.interface';
import { BandejaModel } from './@models/bandeja.model';
import { InformacionContratoResueltoResponse } from '../detalle-resueltos/detalle-resueltos.interface';
import {
  IDetalleCabeceraResponse,
  IDetallePersona
} from 'app/@compartidos/interfaces/detalle.interface';
import { EstadoBandejaEnum } from './bandeja.enum';

export const BandejaStub = {
  carteraGeneralResponsive: <ICarteraGeneralItemResponsive[]>[
    {
      contratos: ['639-595-4'],
      nombres: ['Roberto Hernandez Soto'],
      tipoDocumentos: ['ce'],
      numeroDocumentos: ['4540645'],
      ejecutivo: 'John Doe',
      celularEjecutivo: '984654215',
      anexoEjecutivo: '468',
      correoEjecutivo: 'a@b.co',
      active: true
    }
  ],
  reactivacionModel: <BandejaModel>{
    contratosResueltos: [
      {
        contratoId: '123456',
        cia: 22,
        cuotasPagadas: 13,
        numeroDocumentos: ['2'],
        fechaLiquidacion: '2018-08-29T21:03:11.78-05:00',
        fechaResolucion: '2018-08-29T21:03:11.78-05:00',
        hasAssociated: true,
        nombres: ['Roberto Hernandez Soto'],
        contratos: ['639-595-4'],
        personaIds: ['123456'],
        programa: '6846465',
        tipoBien: 'inmueble',
        tipoDocumentos: ['ce']
      }
    ],
    numeroPaginas: 9,
    numeroRegistros: 95
  },
  carteraGeneral: <CarteraGeneralResponse>{
    contratosCartera: <CarteraGeneralContrato[]>[
      {
        contratos: ['154-584-354'],
        nombres: ['Bolivar', 'Valle', 'Bristhan Juan'],
        tipoDocumentos: ['ce'],
        numeroDocumentos: ['18687488'],
        ejecutivo: '4568761',
        celularEjecutivo: '987654321',
        anexoEjecutivo: '1123',
        correoEjecutivo: 'a@b.co'
      }
    ],
    numeroRegistros: 22,
    numeroPaginas: 2
  },
  contratoResponse: {
    contratosResueltos: [
      {
        fechaSituacionActual: '2018-08-29T21:03:11.78-05:00',
        nombreCliente: ['Roberto Hernandez Soto'],
        personaIds: ['123456'],
        contratos: ['639-595-5'],
        segmento: 'A',
        modalidad: 'Sorteo',
        dias: '15'
      }
    ],
    numeroPaginas: 9,
    numeroRegistros: 94
  },
  contratoResuelto: <InformacionContratoResueltoResponse>{
    cuotaAdministracion: '0.00',
    cuotaCapital: '557.43',
    cuotaTotalMensual: '557.43',
    diaPago: 5,
    fechaResolucion: '2018-12-10T00:00:00.00-05:00',
    grupo: '8111',
    inversionInmobiliaria: 'CANCELACION DE CREDITO HIPOTECARIO',
    marca: null,
    modelo: null,
    nroCuotasVencidas: 9,
    numeroContrato: '8111-003-37',
    porcentajeCuotaAdmin: 18,
    producto: 'C5-Pandero Inmuebles',
    programa: 'C5',
    tipoBien: 'Inmueble',
    valorCertificado: '41250.00',
    nroCuotasPagadas: 1,
    totalAportadoCuotaCapital: '310.46',
    totalAportadoCuotaAdmin: '58.61',
    totalAportado: '369.07'
  },
  asociadoCabeceraResponse: <IDetalleCabeceraResponse>{
    fechaActualizacion: '2018-12-28T16:00:07.00-05:00',
    personas: [
      {
        idPersona: '214647',
        nombrePersona: 'Yupanqui Godo Luis Atahualpa',
        tipoDocumento: 'DNI',
        numeroDocumento: '10555309',
        departamento: 'LIMA',
        direccion: 'Av. Javier Prado Este 650 Of. 503 San Isidro',
        telefonos: ['3545263', '4472985', '3819769'],
        tipoPersona: 'NATURAL',
        telefonosMovil: ['941315859'],
        correo: null,
        correos: ['desarrollo@pandero.com.pe', 'test@pandero.com.pe'],
        genero: 'M',
        urlFoto: 'https://s3-us-west-2.amazonaws.com/qa.ginni.frontfiles/avatars/male_avatar.png'
      }
    ]
  },
  reactivaciones: {
    input: <IReactivacionItemResponsive[]>[
      {
        contratoId: '9876543210',
        cia: 22,
        cuotasPagadas: 7,
        numeroDocumentos: ['18687488'],
        fechaLiquidacion: '2018-04-11T11:03:10.00Z',
        fechaResolucion: '2018-04-11T11:03:10.00Z',
        hasAssociated: true,
        nombres: ['Bolivar', 'Valle', 'Bristhan Juan'],
        estadoBandeja: EstadoBandejaEnum.SIN_SIMULACION,
        contratos: ['154-584-354'],
        personaIds: ['15616e516'],
        programa: '6846465',
        reactivacionContratoID: 123456,
        tipoBien: 'inmueble',
        tipoDocumentos: ['ce'],
        active: false
      },
      {
        contratoId: '123456789',
        cia: 85,
        cuotasPagadas: 15,
        numeroDocumentos: ['54681574'],
        fechaLiquidacion: '2019-08-22T22:07:18.00Z',
        fechaResolucion: '2019-08-22T22:07:18.00Z',
        hasAssociated: false,
        nombres: ['Pari', 'Penadillo', 'Richar'],
        estadoBandeja: EstadoBandejaEnum.CON_SIMULACION,
        contratos: ['861-465-464'],
        personaIds: ['561h8454'],
        programa: '546546',
        reactivacionContratoID: 123457,
        tipoBien: 'vehiculo',
        tipoDocumentos: ['dni'],
        active: false
      }
    ],
    output: <IReactivacionItemResponsive[]>[
      {
        contratoId: '9876543210',
        cia: 22,
        cuotasPagadas: 7,
        numeroDocumentos: ['18687488'],
        fechaLiquidacion: '2018-04-11T11:03:10.00Z',
        fechaResolucion: '2018-04-11T11:03:10.00Z',
        hasAssociated: true,
        nombres: ['Bolivar', 'Valle', 'Bristhan Juan'],
        estadoBandeja: EstadoBandejaEnum.SIN_SIMULACION,
        contratos: ['154-584-354'],
        personaIds: ['15616e516'],
        programa: '6846465',
        reactivacionContratoID: 123456,
        tipoBien: 'inmueble',
        tipoDocumentos: ['ce'],
        active: false
      },
      {
        contratoId: '123456789',
        cia: 85,
        cuotasPagadas: 15,
        numeroDocumentos: ['54681574'],
        fechaLiquidacion: '2019-08-22T22:07:18.00Z',
        fechaResolucion: '2019-08-22T22:07:18.00Z',
        hasAssociated: false,
        nombres: ['Pari', 'Penadillo', 'Richar'],
        estadoBandeja: EstadoBandejaEnum.CON_SIMULACION,
        contratos: ['861-465-464'],
        personaIds: ['561h8454'],
        programa: '546546',
        reactivacionContratoID: 123457,
        tipoBien: 'vehiculo',
        tipoDocumentos: ['dni'],
        active: true
      }
    ],
    cabecera: {
      personas: <IDetallePersona[]>[
        {
          idPersona: '214647',
          nombrePersona: 'Yupanqui Godo Luis Atahualpa',
          tipoDocumento: 'DNI',
          numeroDocumento: '10555309',
          departamento: 'LIMA',
          direccion: 'Av. Javier Prado Este 650 Of. 503 San Isidro',
          telefonos: ['3545263', '4472985', '3819769'],
          tipoPersona: 'NATURAL',
          telefonosMovil: ['941315859'],
          correo: null,
          correos: ['desarrollo@pandero.com.pe', 'test@pandero.com.pe'],
          genero: 'M',
          urlFoto: 'https://s3-us-west-2.amazonaws.com/qa.ginni.frontfiles/avatars/male_avatar.png'
        },
        {
          idPersona: '446616',
          nombrePersona: 'CENTRO DE EST LAT AMERICANO ADM PUBLICA EIRL',
          tipoDocumento: 'RUC',
          numeroDocumento: '20185846971',
          departamento: 'LIMA',
          direccion: 'Av. Javier Prado Este 650 Of. 503 San Isidro',
          nombreRepresentanteLegal: 'Tueros Hinostroza Monica Liliana',
          telefonos: ['6242603', '6243603', '6244603'],
          tipoPersona: 'JURÍDICA',
          telefonosMovil: ['912651887'],
          correo: null,
          correos: ['desarrollo@pandero.com.pe', 'test@pandero.com.pe'],
          genero: null,
          urlFoto:
            'https://s3-us-west-2.amazonaws.com/qa.ginni.frontfiles/avatars/persona_juridica_avatar.png'
        }
      ]
    },
    summary: {
      total: 4082,
      productos: [{ Inmueble: 576 }, { Vehiculo: 3506 }],
      programas: [{ A4: 15467 }, { B1: 1050 }, { C1: 3229 }, { C2: 5572 }]
    }
  },
  personaIds: <string[]>['13256', '11357'],
  bloqueosEnBandeja: {
    habilitarIngreso: true
  },
  bandejaBloqueada: {
    habilitarIngreso: false
  }
};
