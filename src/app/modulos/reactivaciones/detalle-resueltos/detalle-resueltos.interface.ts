export interface InformacionContratoResueltoResponse {
  cuotaAdministracion: string;
  cuotaCapital: string;
  cuotaTotalMensual: string;
  diaPago: number;
  fechaResolucion: string;
  grupo: string;
  inversionInmobiliaria: string;
  marca: string;
  modelo: string;
  nroCuotasVencidas: number;
  numeroContrato: string;
  porcentajeCuotaAdmin: number;
  producto: string;
  programa: string;
  tipoBien: string;
  valorCertificado: string;
  totalAportadoCuotaCapital: string;
  totalAportadoCuotaAdmin: string;
  totalAportado: string;
  nroCuotasPagadas: number;
}

export interface FondoDeRemateResponse {
  fondoRemate: string;
}

export interface MovimientosAdministrativosResponse {
  movimientosAdministrativos: MovimientosAdministrativosDetalle[];
  total: number;
}

export interface MovimientosAdministrativosDetalle {
  fechaMovimiento: string;
  contratoOrigen: string;
  contratoDestino: string;
  movimiento: string;
  cuotasPagadas: string;
  cuotaCapital: number;
  cuotaDeAdministracion: number;
  saldosNoAplicados: number;
}

export interface AdjudicadosTipo {
  numeroAsamblea: string;
  cuotasRemate: number[];
  cuotasSorteo: number;
}

export interface CiaTipo {
  ci: string;
  montoPorPagar: number;
  montoPagado: number;
  conAsterisco: boolean;
}

export interface ProximasAsambleasTipo {
  numeroAsamblea: number;
  fechaProximaAsamblea: string;
  indicadorAsambleaResueltos: boolean;
}

export interface TipoDeBien {
  listaId: number;
  nombre: string;
}

export interface ContratoResueltoInfoSimulacion {
  listaContratos: ListaContratosResueltos[];
  listaTipoBien: TipoDeBien[];
  maximoAfusionar: number;
}

export interface DetalleDeContrato {
  fechaResolucion: string;
  diaPago: number;
  cuotaAdministracion: string;
  inversionInmobiliaria: string;
  nroCuotasVencidas: number;
  nroCuotasPagadas: number;
}

export interface ListaContratosResueltos {
  contratoID: number;
  numeroContrato: string;
  programa: string;
  producto: string;
  grupo: string;
  tipoBien: string;
  tipoBienId: number;
  valorCertificado: string;
  modelo: string;
  marca: string;
  porcentajeCuotaAdmin: number;
  cuotaCapital: string;
  cuotaTotalMensual: string;
  montoAporte: number;
  detalleContrato: DetalleDeContrato;
  contratoOrigen: boolean;
}

export interface ContratoResueltoRelacionadosSimulacion {
  contratoID: number;
  contratoOrigen: boolean;
  cuotaCapital: string;
  cuotaTotalMensual: string;
  detalleContrato: DetalleDeContrato;
  grupo: string;
  habilitarSeleccion: boolean;
  numeroContrato: string;
  marca: string;
  modelo: string;
  montoAporte: number;
  porcentajeCuotaAdmin: number;
  producto: string;
  programa: string;
  tipoBien: string;
  tipoBienId: number;
  valorCertificado: string;
}

export interface TiposDeBien {
  listaId: number;
  nombre: string;
}

export interface ContratosYTipoDeBien {
  contratos: number[];
  codigoTipoBien: number;
}

export interface CodigoValor {
  codigo: number;
  valor: string;
  habilitarGuardado?: boolean;
}

export interface CodigoNumero {
  codigo: number;
  valor: number;
}

export interface ListaDeGruposResponse {
  grupoId: number;
  numeroGrupo: string;
  diaPago: number;
  numeroAsamblea: number;
  proximaAsamblea: number;
  fechaProximaAsamblea: string;
  ultimosRemates: number[];
  ganadoresSorteo: number;
  vacantes: number;
  resaltado: boolean;
  fechaInauguracion: string;
  porcentajeCuotaAdmin: number;
  numeroMeses: string;
  movimientoTipo: string;
}

export interface ListaDeGruposRequest {
  contratos: number[];
  codigoProducto: number;
}

export interface SimuladorRequest {
  modo: number;
  grupoId: number;
  certificadoId: number;
  contratosId: number[];
}

export interface SimuladorPutRequest {
  modo: number;
  grupoId: number;
  certificadoId: number;
  contratosId: number[];
  cuotaCelebracion: number;
  cuotaAdjudicacion: number;
  cias: SimulacionesCias[];
  diferenciaCiaValor: number;
}

export interface SimuladorResponse {
  cuotasAdjudicacion: CuotasSimulacion;
  cuotasCelebracion: CuotasSimulacion;
  cuotasProrateo: CuotasSimulacion;
  simulaciones: Simulaciones[];
}

export interface CuotasSimulacion {
  valor: number;
  activo: boolean;
}

export interface Simulaciones {
  cuotaAdministracion: number;
  cuotaCapital: number;
  cuotaTotal: number;
  detalle: SimulacionesDetalle;
  importeADiferir: number;
  importeAUltimasCuotas: number;
  importeAUltimasCuotasAdm: number;
  importeAUltimasCuotasCap: number;
  importePorPagar: number;
  numeroCuotasIngreso: number;
  numeroCuotasPorDiferir: number;
  numeroMesesAPagar: number;
}

export interface SimulacionesDetalle {
  cias: SimulacionesCias[];
  costoReactivacion: number;
  diferenciaCiaMinima: number;
  diferenciaCiaMaxima: number;
  diferenciaCiaValor: number | string;
  importeAbonadoAdjudicacion: number;
  importeCelebracionContrato: number;
  importeTotalAPagar: number;
  nuevaCuotaMes: number;
  saldoAFavor: number;
  totalAPagar: number;
  totalPagosCuotasAdministrativas: number;
  totalPagosCuotasCapitales: number;
}

export interface SimulacionesCias {
  contratoId: number;
  saldoMinimo?: number;
  saldoMaximo?: number;
  saldo: number | string;
}

export interface GuardarSimulacionRequest {
  listaIDTipoBienServicio: number;
  grupoID: number;
  certificadoPosicionID: number;
  marcaID: number;
  bienServicioID: number;
  numeroFormato: string;
  listaIDSimulacionOpcion: string;
  contratoId: number;
  importeDiferenciaCIA: number | string;
  movimientoSimulacionDetalle: CiaDetalle[];
}

export interface CiaDetalle {
  contratoId: number;
  importeCIA: number | string;
}

export interface PagarObligacionACuentaResponse {
  mensaje: string;
}

export interface GuardarSimulacionResponse extends PagarObligacionACuentaResponse {
  fechaUltimaSimulacion: string;
}

export interface CargarSimulacionResponse {
  existeSimulacion: boolean;
  existeValidacion: boolean;
  mensajeValidacion: string;
}

export interface GruposSimulacionResponse {
  listaContratos: ListaContratosResueltos[];
}

export interface ListasSimulacionResponse {
  certificado: {
    lista: CodigoNumero[];
    listaIdSelected: number;
  };
  grupo: ListaDeGruposResponse;
  inversionInmobiliaria: {
    lista: CodigoValor[];
    listaIdSelected: number;
  };
  marca: {
    lista: CodigoValor[];
    listaIdSelected: number;
  };
  modelo: {
    lista: CodigoValor[];
    listaIdSelected: number;
  };
  numeroFormato: {
    lista: CodigoValor[];
    listaIdSelected: number;
  };
  producto: {
    lista: CodigoValor[];
    listaIdSelected: number;
  };
  tipobien: {
    lista: TiposDeBien[];
    listaIdSelected: number;
  };
}

export interface SimulacionResponse {
  simulacionResponse: SimuladorResponse;
  metodos: {
    lista: CodigoValor[];
    listaIdSelected: number;
  };
}

export interface SimulationResponse {
  tipoDeBienControl: {
    lista: CodigoValor[];
    listaIdSelected: number;
  };
  programaProductosControl: {
    lista: CodigoValor[];
    listaIdSelected: number;
  };
  grupo: {
    numeroGrupo: number;
  };
  certificado: {
    lista: CodigoValor[];
    listaIdSelected: number;
  };
  marca: {
    lista: CodigoValor[];
    listaIdSelected: number;
  };
  modelo: {
    lista: CodigoValor[];
    listaIdSelected: number;
  };
  numeroFormato: string;
  inversionInmobiliaria: {
    lista: CodigoValor[];
    listaIdSelected: number;
  };
  updateSimulacionControl: number;
  diferenciaCiaControl: string;
}

export interface GenerarObligacionACuentaResponse extends PagarObligacionACuentaResponse {
  contratoId: string;
  contratoSafId: string;
  numeroContrato: string;
}

export interface PagoACuenta {
  montoControl: string;
}

export interface GenerarSimulacionRequest {
  bdImporte: string;
  reactivacionContratoId: number;
}

export interface HistorialDePagoResponse {
  historialPagos: HistorialPagos[];
  montoTotal: number;
}

export interface HistorialPagos {
  concepto: string;
  contratoNumero: string;
  estado: string;
  fechaPago: string;
  monto: string;
  saldo: string;
  solicitudIdSaf: number;
  usuario: string;
}

export interface PagoGeneradoResponse {
  pagoGenerado: boolean;
}
