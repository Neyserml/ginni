export const ValidationServiceStub = {
  validateEmail: () => ({ error: 'error' }),
  validateNumber: () => ({ error: 'error' }),
  validateMonto: () => null,
  matchingInputs: () => null,
  convertFormattedToDate: () => new Date(),
  isValidDate: () => true,
  getDateObject: () => ({
    year: '2019',
    month: '05',
    date: '29'
  }),
  fechaNacimiento: () => ({ descripcion: 'descripcion' }),
  fechaMaximaActual: () => null,
  setearTiempoACero: () => new Date(),
  fechaValidation: () => ({ descripcion: 'descripcion' }),
  direccionValidation: () => () => ({ key: 'key' }),
  ceroPrimerDigitoValidation: () => ({ key: 'key' })
};
