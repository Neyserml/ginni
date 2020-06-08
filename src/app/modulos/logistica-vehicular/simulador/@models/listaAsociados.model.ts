export class ListaAsociadosBuscados {
  value: string;
  text: string;
  idPersona: string;
  nombre: string;
  arrayListaAsociados: Array<any> = [];
  map: () => any;

  constructor(contratoItem) {
    contratoItem.map(contrato => {
      this.arrayListaAsociados.push({
        value: contrato.idPersona,
        text: contrato.nombre
      });
    });
  }
}
