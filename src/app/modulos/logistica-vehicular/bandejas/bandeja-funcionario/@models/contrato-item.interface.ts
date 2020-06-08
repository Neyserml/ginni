export interface IContratoItem {
  ecAprobada: boolean;
  fechaSituacionActual: string;
  nombres: string[];
  personaId: string;
  contratoId: string;
  numeroContrato: string;
  segmento: string;
  modalidades: string[];
  dias: string;
  contratos: string[];
  bloqueContratoID?: number;
}
