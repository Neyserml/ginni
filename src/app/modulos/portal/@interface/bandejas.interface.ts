import { IProp } from 'app/@compartidos/models';

export interface IColumna {
  name: string; // Descripcion de la columna
  id?: string; // Clave que se le envia al servicio
  focus: boolean; // Esta seleccionado
  asc: boolean; // true es ascendente, false es descendente
  className?: string;
}

export interface IHTMLBooleanElement {
  column: IColumna;
  label: string;
  value: boolean;
}

export interface IListaProps {
  [key: string]: IProp[];
}
