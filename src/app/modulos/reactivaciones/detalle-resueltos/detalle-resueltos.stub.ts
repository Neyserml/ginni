import {
  AdjudicadosTipo,
  CiaDetalle,
  CiaTipo,
  CodigoNumero,
  CodigoValor,
  ContratoResueltoInfoSimulacion,
  ContratoResueltoRelacionadosSimulacion,
  ContratosYTipoDeBien,
  FondoDeRemateResponse,
  GenerarObligacionACuentaResponse,
  GenerarSimulacionRequest,
  GuardarSimulacionRequest,
  GuardarSimulacionResponse,
  ListaDeGruposRequest,
  ListaDeGruposResponse,
  MovimientosAdministrativosDetalle,
  MovimientosAdministrativosResponse,
  PagarObligacionACuentaResponse,
  ProximasAsambleasTipo,
  SimuladorPutRequest,
  SimuladorRequest,
  SimuladorResponse,
  SimulationResponse,
  TiposDeBien
} from './detalle-resueltos.interface';
import { MovimientosAdministrativos } from './detalle-resueltos.enum';

export const DetalleStub = {
  contratoResponse: {
    numeroContrato: '',
    programa: '',
    producto: '',
    grupo: '',
    tipoBien: '',
    valorCertificado: '',
    fechaResolucion: '',
    diaPago: null,
    nroCuotasVencidas: null,
    porcentajeCuotaAdmin: null,
    cuotaCapital: '',
    cuotaAdministracion: '',
    cuotaTotalMensual: '',
    inversionInmobiliaria: '',
    modelo: '',
    marca: ''
  },
  contratoResueltoRelacionadosSimulacion: <ContratoResueltoRelacionadosSimulacion[]>[
    {
      contratoID: 137468,
      numeroContrato: '3602-157-27',
      programa: 'C6',
      producto: 'HYUNDAI',
      grupo: '3602',
      tipoBien: 'Vehículo',
      tipoBienId: 34,
      valorCertificado: '15000.00',
      modelo: 'ACCENT',
      marca: 'HYUNDAI',
      porcentajeCuotaAdmin: 14,
      cuotaCapital: '250.00',
      cuotaTotalMensual: '250.00',
      montoAporte: null,
      detalleContrato: {
        fechaResolucion: '2019-03-23T08:31:01.00-05:00',
        diaPago: 20,
        cuotaAdministracion: '0.00',
        inversionInmobiliaria: null,
        nroCuotasVencidas: 6,
        nroCuotasPagadas: 13
      },
      contratoOrigen: true
    },
    {
      contratoID: 139827,
      numeroContrato: '3603-138-17',
      programa: 'C6',
      producto: 'HYUNDAI',
      grupo: '3603',
      tipoBien: 'Vehículo',
      tipoBienId: 35,
      valorCertificado: '15000.00',
      modelo: 'ACCENT',
      marca: 'HYUNDAI',
      porcentajeCuotaAdmin: 14,
      cuotaCapital: '250.00',
      cuotaTotalMensual: '250.00',
      montoAporte: null,
      detalleContrato: {
        fechaResolucion: '2019-05-13T16:52:25.00-05:00',
        diaPago: 5,
        cuotaAdministracion: '0.00',
        inversionInmobiliaria: null,
        nroCuotasVencidas: 5,
        nroCuotasPagadas: 4
      },
      contratoOrigen: false
    }
  ],
  contratoResueltoInfoSimulacion: <ContratoResueltoInfoSimulacion>{
    listaContratos: [
      {
        contratoID: 137468,
        numeroContrato: '3602-157-27',
        programa: 'C6',
        producto: 'HYUNDAI',
        grupo: '3602',
        tipoBien: 'Vehículo',
        tipoBienId: 34,
        valorCertificado: '15000.00',
        modelo: 'ACCENT',
        marca: 'HYUNDAI',
        porcentajeCuotaAdmin: 14,
        cuotaCapital: '250.00',
        cuotaTotalMensual: '250.00',
        montoAporte: null,
        detalleContrato: {
          fechaResolucion: '2019-03-23T08:31:01.00-05:00',
          diaPago: 20,
          cuotaAdministracion: '0.00',
          inversionInmobiliaria: null,
          nroCuotasVencidas: 6,
          nroCuotasPagadas: 13
        },
        contratoOrigen: true
      },
      {
        contratoID: 139827,
        numeroContrato: '3603-138-17',
        programa: 'C6',
        producto: 'HYUNDAI',
        grupo: '3603',
        tipoBien: 'Vehículo',
        tipoBienId: 35,
        valorCertificado: '15000.00',
        modelo: 'ACCENT',
        marca: 'HYUNDAI',
        porcentajeCuotaAdmin: 14,
        cuotaCapital: '250.00',
        cuotaTotalMensual: '250.00',
        montoAporte: null,
        detalleContrato: {
          fechaResolucion: '2019-05-13T16:52:25.00-05:00',
          diaPago: 5,
          cuotaAdministracion: '0.00',
          inversionInmobiliaria: null,
          nroCuotasVencidas: 5,
          nroCuotasPagadas: 4
        },
        contratoOrigen: false
      }
    ],
    listaTipoBien: [
      {
        listaId: 34,
        nombre: 'Inmueble'
      },
      {
        listaId: 35,
        nombre: 'Vehículo'
      }
    ],
    maximoAfusionar: 50
  },
  tiposDeBien: <TiposDeBien[]>[
    {
      listaId: 34,
      nombre: 'Inmueble'
    },
    {
      listaId: 35,
      nombre: 'Vehículo'
    }
  ],
  contratosYTipoDeBien: <ContratosYTipoDeBien>{
    contratos: [137468, 139812],
    codigoTipoBien: 35
  },
  fondoRemate: <FondoDeRemateResponse>{
    fondoRemate: '1245.60'
  },
  movimientosAdministrativos: <MovimientosAdministrativosResponse>{
    total: 5500.0,
    movimientosAdministrativos: <MovimientosAdministrativosDetalle[]>[
      {
        fechaMovimiento: '2019-04-23T09:00:00.00-05:00',
        contratoOrigen: '1100-140-14',
        contratoDestino: '1100-059-22',
        movimiento: 'Reubicación',
        cuotasPagadas: '03',
        cuotaCapital: 2000.0,
        cuotaDeAdministracion: 1000.0,
        saldosNoAplicados: 1500.0
      }
    ]
  },
  guardarSimulacionRequest: <GuardarSimulacionRequest>{
    movimientoAdministrativo: MovimientosAdministrativos.Recupero,
    listaIDTipoBienServicio: 35,
    grupoID: 529,
    certificadoPosicionID: 3,
    programaID: 3,
    productoID: 15,
    marcaID: 87,
    bienServicioID: 35,
    numeroFormato: '111221',
    asambleaIngreso: '45',
    listaIDSimulacionOpcion: '122',
    cuotasCelebracion: 0,
    cuotasAdjudicacion: 0,
    cuotasProrrateo: 0,
    cuotaIngreso: 1,
    importeCuotaCapital: 213.24,
    importeCuotaAdministracion: 40,
    contratoId: 65573,
    importeDiferenciaCIA: 113.75,
    movimientoSimulacionDetalle: <CiaDetalle[]>[
      {
        contratoId: 65573,
        importeCIA: 10.58
      },
      {
        contratoId: 65581,
        importeCIA: 400.0
      }
    ]
  },
  guardarSimulacionResponse: <GuardarSimulacionResponse>{
    fechaUltimaSimulacion: '2019-09-19T10:47:18.16-05:00',
    mensaje: 'Guardado correctamente'
  },
  ciaDetalle: <CiaTipo[]>[
    {
      ci: 'A',
      montoPorPagar: 0.0,
      montoPagado: 849.6,
      conAsterisco: false
    },
    {
      ci: 'B',
      montoPorPagar: 500.9,
      montoPagado: 0.0,
      conAsterisco: false
    },
    {
      ci: 'C',
      montoPorPagar: 1274.0,
      montoPagado: 0,
      conAsterisco: true
    }
  ],
  proximasAsambleas: <ProximasAsambleasTipo[]>[
    {
      numeroAsamblea: 3,
      fechaProximaAsamblea: '2019-09-10T16:00:00.00-05:00',
      indicadorAsambleaResueltos: true
    },
    {
      numeroAsamblea: 4,
      fechaProximaAsamblea: '2019-10-10T16:00:00.00-05:00',
      indicadorAsambleaResueltos: false
    },
    {
      numeroAsamblea: 5,
      fechaProximaAsamblea: '2019-11-08T09:00:00.00-05:00',
      indicadorAsambleaResueltos: false
    }
  ],
  programaProductos: <CodigoValor[]>[
    {
      codigo: 17,
      valor: 'C3-VOLKSWAGEN'
    },
    {
      codigo: 18,
      valor: 'C3-SUZUKI'
    },
    {
      codigo: 19,
      valor: 'C3-HYUNDAI'
    },
    {
      codigo: 20,
      valor: 'C3-4X4'
    },
    {
      codigo: 12,
      valor: 'C1-VOLKSWAGEN'
    },
    {
      codigo: 13,
      valor: 'C1-SUZUKI'
    },
    {
      codigo: 10,
      valor: 'C1-4X4'
    },
    {
      codigo: 11,
      valor: 'C1-HYUNDAI'
    },
    {
      codigo: 14,
      valor: 'C1-PREMIUM'
    },
    {
      codigo: 24,
      valor: 'C1-CHEVROLET'
    },
    {
      codigo: 15,
      valor: 'C2-PROVINCIAS'
    },
    {
      codigo: 16,
      valor: 'C3-YA'
    },
    {
      codigo: 21,
      valor: 'CONCESIONARIO'
    },
    {
      codigo: 23,
      valor: 'C5-Pandero Inmuebles'
    },
    {
      codigo: 25,
      valor: 'C6-4X4'
    },
    {
      codigo: 26,
      valor: 'C6-SUZUKI'
    },
    {
      codigo: 27,
      valor: 'C6-HYUNDAI'
    },
    {
      codigo: 28,
      valor: 'C6-VOLKSWAGEN'
    }
  ],
  listaDeGrupos: <ListaDeGruposResponse[]>[
    {
      grupoId: 356,
      numeroGrupo: '1102',
      diaPago: 20,
      numeroAsamblea: 42,
      proximaAsamblea: 43,
      fechaProximaAsamblea: '2017-02-15T17:00:00.00-05:00',
      ultimosRemates: [9, 14, 8],
      ganadoresSorteo: 3,
      vacantes: 2,
      resaltado: true,
      fechaInauguracion: '2015-11-23T18:30:00.00-05:00',
      porcentajeCuotaAdmin: 14,
      movimientoTipo: 'Recupero'
    },
    {
      grupoId: 409,
      numeroGrupo: '1500',
      diaPago: 5,
      numeroAsamblea: 27,
      proximaAsamblea: 28,
      fechaProximaAsamblea: '2017-02-15T17:00:00.00-05:00',
      ultimosRemates: [9, 12, 8],
      ganadoresSorteo: 1,
      vacantes: 5,
      resaltado: false,
      fechaInauguracion: '2017-02-15T17:00:00.00-05:00',
      porcentajeCuotaAdmin: 35,
      movimientoTipo: 'Reubicación'
    }
  ],
  listaDeGruposRequest: <ListaDeGruposRequest>{
    contratos: [9996, 7999],
    codigoProducto: 35
  },
  adjudicadosTipo: <AdjudicadosTipo[]>[
    {
      numeroAsamblea: '16',
      cuotasRemate: [16, 17, 16],
      cuotasSorteo: 1
    },
    {
      numeroAsamblea: '15',
      cuotasRemate: [],
      cuotasSorteo: 1
    },
    {
      numeroAsamblea: '14',
      cuotasRemate: [20, 18, 13, 13],
      cuotasSorteo: 1
    }
  ],
  inversionInmobiliaria: <CodigoValor[]>[
    {
      codigo: 14,
      valor: 'Alquiler'
    },
    {
      codigo: 15,
      valor: 'Venta'
    }
  ],
  certificados: <CodigoNumero[]>[
    {
      codigo: 1,
      valor: 13800
    },
    {
      codigo: 2,
      valor: 14400
    },
    {
      codigo: 3,
      valor: 16200
    },
    {
      codigo: 4,
      valor: 18000
    },
    {
      codigo: 5,
      valor: 20400
    },
    {
      codigo: 6,
      valor: 22800
    },
    {
      codigo: 7,
      valor: 24000
    },
    {
      codigo: 8,
      valor: 27000
    }
  ],
  marcas: <CodigoValor[]>[
    {
      codigo: 1,
      valor: 'AUDI'
    },
    {
      codigo: 32,
      valor: 'BAW'
    },
    {
      codigo: 41,
      valor: 'BRILLIANCE'
    },
    {
      codigo: 47,
      valor: 'BYD'
    },
    {
      codigo: 29,
      valor: 'CHANGAN'
    },
    {
      codigo: 45,
      valor: 'CHERY'
    },
    {
      codigo: 2,
      valor: 'CHEVROLET'
    },
    {
      codigo: 14,
      valor: 'CITROEN'
    },
    {
      codigo: 4,
      valor: 'DAIHATSU'
    },
    {
      codigo: 35,
      valor: 'DONGFENG'
    },
    {
      codigo: 22,
      valor: 'FAW'
    },
    {
      codigo: 56,
      valor: 'FIAT'
    },
    {
      codigo: 16,
      valor: 'FORD'
    },
    {
      codigo: 38,
      valor: 'FORLAND'
    },
    {
      codigo: 31,
      valor: 'FOTON'
    },
    {
      codigo: 23,
      valor: 'GEELY'
    },
    {
      codigo: 24,
      valor: 'GREAT WALL'
    },
    {
      codigo: 21,
      valor: 'HAFEI'
    },
    {
      codigo: 34,
      valor: 'HAIMA'
    },
    {
      codigo: 50,
      valor: 'HILUX'
    },
    {
      codigo: 46,
      valor: 'HINO'
    },
    {
      codigo: 13,
      valor: 'HONDA'
    },
    {
      codigo: 5,
      valor: 'HYUNDAI'
    },
    {
      codigo: 18,
      valor: 'ISUZU'
    },
    {
      codigo: 30,
      valor: 'JAC'
    },
    {
      codigo: 25,
      valor: 'JEEP'
    },
    {
      codigo: 27,
      valor: 'JINBEI'
    },
    {
      codigo: 58,
      valor: 'JMC'
    },
    {
      codigo: 52,
      valor: 'KENBO'
    },
    {
      codigo: 6,
      valor: 'KIA'
    },
    {
      codigo: 37,
      valor: 'LAND ROVER'
    },
    {
      codigo: 33,
      valor: 'MAHINDRA'
    },
    {
      codigo: 7,
      valor: 'MAZDA'
    },
    {
      codigo: 53,
      valor: 'MERCEDES BENZ'
    },
    {
      codigo: 49,
      valor: 'MG'
    },
    {
      codigo: 42,
      valor: 'MINI'
    },
    {
      codigo: 8,
      valor: 'MITSUBISHI'
    },
    {
      codigo: 9,
      valor: 'NISSAN'
    },
    {
      codigo: 10,
      valor: 'PEUGEOT'
    },
    {
      codigo: 20,
      valor: 'PORSCHE'
    },
    {
      codigo: 44,
      valor: 'RENAULT'
    },
    {
      codigo: 15,
      valor: 'SEAT'
    },
    {
      codigo: 17,
      valor: 'SSANGYONG'
    },
    {
      codigo: 48,
      valor: 'SUBARU'
    },
    {
      codigo: 11,
      valor: 'SUZUKI'
    },
    {
      codigo: 43,
      valor: 'TOYOTA'
    },
    {
      codigo: 12,
      valor: 'VOLKSWAGEN'
    },
    {
      codigo: 36,
      valor: 'VOLVO'
    },
    {
      codigo: 62,
      valor: 'WINGS'
    },
    {
      codigo: 51,
      valor: 'WISU'
    }
  ],
  modelos: <CodigoValor[]>[
    {
      codigo: 165,
      valor: 'BT-50'
    },
    {
      codigo: 243,
      valor: 'CX-9'
    },
    {
      codigo: 600,
      valor: 'MAZDA 2'
    },
    {
      codigo: 615,
      valor: 'MAZDA 5'
    },
    {
      codigo: 616,
      valor: 'MAZDA 6'
    },
    {
      codigo: 1044,
      valor: 'CX5'
    },
    {
      codigo: 1389,
      valor: 'MX5'
    },
    {
      codigo: 1433,
      valor: 'CX3'
    }
  ],
  simuladorRequest: <SimuladorRequest>{
    modo: 122,
    grupoId: 365,
    certificadoId: 8,
    contratosId: [79336, 79338, 125185]
  },
  simuladorPutRequest: <SimuladorPutRequest>{
    modo: 122,
    grupoId: 365,
    certificadoId: 8,
    contratosId: [79336, 79338, 125185],
    cuotaCelebracion: 123.0,
    cuotaAdjudicacion: 234.0,
    cias: [
      {
        contratoId: 123.0,
        saldoMinimo: 234.0,
        saldoMaximo: 456.0,
        saldo: 345.0
      },
      {
        contratoId: 234.0,
        saldoMinimo: 345.0,
        saldoMaximo: 567.0,
        saldo: 456.0
      }
    ],
    diferenciaCiaValor: 345.0,
    diferenciaCiaMaxima: 456.0,
    diferenciaCiaMinima: 234.0
  },
  simuladorResponse: <SimuladorResponse>{
    cuotasCelebracion: {
      valor: 0,
      activo: false
    },
    cuotasProrateo: {
      valor: 0,
      activo: false
    },
    cuotasAdjudicacion: {
      valor: 0,
      activo: false
    },
    simulaciones: [
      {
        numeroMesesAPagar: 78,
        numeroCuotasIngreso: 1,
        cuotaCapital: 333.33,
        cuotaAdministracion: 62.93,
        cuotaTotal: 396.26,
        numeroCuotasPorDiferir: 39,
        importeADiferir: 15454.14,
        importePorPagar: 0,
        importeAUltimasCuotas: 3566.34
      }
    ]
  },
  metodosResponse: <CodigoValor[]>[
    {
      codigo: 122,
      valor: 'MEJOR OPCIÓN',
      habilitarGuardado: false
    },
    {
      codigo: 123,
      valor: 'MANTENER CUOTA',
      habilitarGuardado: false
    },
    {
      codigo: 124,
      valor: 'ASAMBLEA ADICIONAL',
      habilitarGuardado: false
    }
  ],
  simulationResponse: <SimulationResponse>{
    tipoDeBienControl: {
      lista: [
        {
          codigo: 123,
          valor: '456'
        }
      ],
      listaIdSelected: 456
    },
    programaProductosControl: {
      lista: [
        {
          codigo: 123,
          valor: '456'
        }
      ],
      listaIdSelected: 456
    },
    grupo: {
      numeroGrupo: 123
    },
    certificado: {
      lista: [
        {
          codigo: 123,
          valor: '456'
        }
      ],
      listaIdSelected: 456
    },
    marca: {
      lista: [
        {
          codigo: 123,
          valor: '456'
        }
      ],
      listaIdSelected: 456
    },
    modelo: {
      lista: [
        {
          codigo: 123,
          valor: '456'
        }
      ],
      listaIdSelected: 456
    },
    numeroFormato: '123',
    inversionInmobiliaria: {
      lista: [
        {
          codigo: 123,
          valor: '456'
        }
      ],
      listaIdSelected: 456
    },
    updateSimulacionControl: 123,
    diferenciaCiaControl: '123'
  },
  pagarObligacionACuentaRequest: <GuardarSimulacionRequest>{
    listaIDTipoBienServicio: 34,
    grupoID: 501,
    certificadoPosicionID: 7,
    marcaID: null,
    bienServicioID: 1510,
    numeroFormato: '7625362',
    listaIDSimulacionOpcion: '122',
    contratoId: 77533,
    importeDiferenciaCIA: '200.23',
    movimientoSimulacionDetalle: [
      {
        contratoId: 77533,
        importeCIA: '0'
      }
    ]
  },
  generarObligacionACuentaResponse: <GenerarObligacionACuentaResponse>{
    contratoId: null,
    contratoSafId: null,
    numeroContrato: null,
    mensaje: 'Contrato Generado'
  },
  generarSimulacionRequest: <GenerarSimulacionRequest>{
    bdImporte: '1120.00',
    reactivacionContratoId: 56380
  },
  pagarObligacionACuentaResponse: <PagarObligacionACuentaResponse>{
    mensaje: 'Se guardo con éxito'
  },
  pagoGenerado: {
    pagoGenerado: true
  }
};
