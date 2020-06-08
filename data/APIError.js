module.exports = class APIError {
  constructor(codigo, mensaje) {
    this.codigo = codigo;
    this.mensaje = mensaje;
  }
};
