import { IModalContrato } from 'app/modulos/logistica-vehicular/detalle/evaluacion/@interface/modal-lista-contratos.interface';

export class ModalContratos {
  filter: (prop) => any;
  forEach: (prop) => any;

  constructor(contratos: IModalContrato[] = null) {
    if (contratos) {
      const arrayContratos: IModalContrato[] = [];
      contratos.map((contrato: IModalContrato) => {
        arrayContratos.push({
          ...contrato,
          selected: false
        });
      });
      return arrayContratos;
    } else {
      return [];
    }
  }
}
