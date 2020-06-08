import { IGaranteDetalle } from '../@interface/garante.interface';
import { EMPTY } from 'app/@compartidos/utils/consts';

export class ObtenerGarante implements IGaranteDetalle {
  idRelacion: string;
  idPersonaRelacionada: string;
  idPersona: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  idTipoRelacion: string;
  idEstadoCivil: string;
  tipoDocumento: string;
  numeroDocumento: string;
  tipoPersona: string;
  idPaisNacionalidad: string;
  fechaNacimiento: string;
  idSexo: string;
  correo: string;
  celular: string;
  telefonoFijo: string;
  estadoPEP: boolean;
  direccionDomicilio = {
    // : IDireccionLaboral
    direccionTexto: EMPTY,
    idDepartamento: EMPTY,
    idDistrito: EMPTY,
    idProvincia: EMPTY,
    nombreZona: EMPTY,
    referencia: EMPTY,
    idTipoZona: EMPTY,
    idTipoVia: EMPTY
  };
  aportaIngresos: boolean;
  mensajesAlertas: string[];
  esLegal: boolean;
  tipoGarante?: string;

  constructor(garante: IGaranteDetalle) {
    this.idRelacion = garante ? garante.idRelacion : (this.idRelacion = EMPTY);
    this.idPersonaRelacionada = garante
      ? garante.idPersonaRelacionada
      : (this.idPersonaRelacionada = EMPTY);
    this.idPersona = garante ? garante.idPersona : (this.idPersona = EMPTY);
    this.nombres = garante ? garante.nombres : EMPTY;
    this.apellidoPaterno = garante ? garante.apellidoPaterno : EMPTY;
    this.apellidoMaterno = garante ? garante.apellidoMaterno : EMPTY;
    this.idTipoRelacion = garante ? garante.idTipoRelacion : EMPTY;
    this.idEstadoCivil = garante ? garante.idEstadoCivil : EMPTY;
    this.tipoDocumento = garante ? garante.tipoDocumento : EMPTY;
    this.numeroDocumento = garante ? garante.numeroDocumento : EMPTY;
    this.tipoPersona = garante ? garante.tipoPersona : EMPTY;
    this.idPaisNacionalidad = garante ? garante.idPaisNacionalidad : EMPTY;
    this.fechaNacimiento = garante ? garante.fechaNacimiento : EMPTY;
    this.idSexo = garante ? garante.idSexo : EMPTY;
    this.correo = garante ? garante.correo : EMPTY;
    this.celular = garante ? garante.celular : EMPTY;
    this.telefonoFijo = garante ? garante.telefonoFijo : EMPTY;
    this.estadoPEP = garante ? garante.estadoPEP : false;

    if (garante && garante.direccionDomicilio) {
      this.direccionDomicilio.idDepartamento = garante.direccionDomicilio.idDepartamento
        ? garante.direccionDomicilio.idDepartamento
        : EMPTY;
      this.direccionDomicilio.idProvincia = garante.direccionDomicilio.idProvincia
        ? garante.direccionDomicilio.idProvincia
        : EMPTY;
      this.direccionDomicilio.idDistrito = garante.direccionDomicilio.idDistrito
        ? garante.direccionDomicilio.idDistrito
        : EMPTY;
      this.direccionDomicilio.idTipoZona = garante.direccionDomicilio.idTipoZona
        ? garante.direccionDomicilio.idTipoZona
        : EMPTY;
      this.direccionDomicilio.nombreZona = garante.direccionDomicilio.nombreZona
        ? garante.direccionDomicilio.nombreZona
        : EMPTY;
      this.direccionDomicilio.idTipoVia = garante.direccionDomicilio.idTipoVia
        ? garante.direccionDomicilio.idTipoVia
        : EMPTY;

      this.direccionDomicilio.referencia = garante.direccionDomicilio.referencia
        ? garante.direccionDomicilio.referencia
        : EMPTY;
      this.direccionDomicilio.direccionTexto = garante.direccionDomicilio.direccionTexto
        ? garante.direccionDomicilio.direccionTexto
        : EMPTY;
    } else {
      this.direccionDomicilio.direccionTexto = EMPTY;
      this.direccionDomicilio.idDepartamento = EMPTY;
      this.direccionDomicilio.idDistrito = EMPTY;
      this.direccionDomicilio.idProvincia = EMPTY;
      this.direccionDomicilio.nombreZona = EMPTY;
      this.direccionDomicilio.referencia = EMPTY;
      this.direccionDomicilio.idTipoZona = EMPTY;
      this.direccionDomicilio.idTipoVia = EMPTY;
    }

    this.aportaIngresos = garante ? garante.aportaIngresos : false;
    this.mensajesAlertas = garante ? garante.mensajesAlertas : [];
    this.esLegal = garante ? garante.esLegal : false;
    this.tipoGarante = garante ? garante.tipoGarante : EMPTY;
  }
}
