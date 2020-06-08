export const ERROR_MESSAGE =
  'Ocurrió un error inesperado, estamos resolviendo el problema. Vuelve a intentarlo más tarde.';

interface IErrorService {
  codigo?: string;
  mensaje?: string;
}

export class APIError {
  status: number;
  codigo: string;
  mensaje = ERROR_MESSAGE;
  constructor(status = 500, error?: IErrorService) {
    this.status = status;
    if (error) {
      this.codigo = error.codigo;
      this.mensaje = error.mensaje || ERROR_MESSAGE;
    }
  }
}
