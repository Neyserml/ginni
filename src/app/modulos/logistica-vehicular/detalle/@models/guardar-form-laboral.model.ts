import { ICargoOcupacion } from './editar.interface';
import { IContacto, IDireccionLaboral, IInformacionLaboralResponse } from './laboral.model';

export interface IPayloadLaboral {
  idPersona: string;
  laboral: IInformacionLaboralResponse;
  form: any;
}

export interface IRequestFormLaboral {
  centroTrabajo: string;
  cargoOcupacion: ICargoOcupacion;
  idTipoTrabajador: string;
  fechaIngresoTrabajo: string;
  direccion: IDireccionLaboral;
  contacto: IContacto;
  estadoPEP: boolean;
  estadoUIF: boolean;
  estadoPLA: boolean;
  estadoAM: boolean;
}

export class GuardarFormLaboral {
  idPersona: string;
  body: IRequestFormLaboral;
  constructor(payload: IPayloadLaboral) {
    this.idPersona = payload.idPersona;
    this.body = payload.form;
    this.body.estadoAM = payload.laboral.estadoAM;
    this.body.estadoPLA = payload.laboral.estadoPLA;
    this.body.estadoUIF = payload.laboral.estadoUIF;
  }
}
