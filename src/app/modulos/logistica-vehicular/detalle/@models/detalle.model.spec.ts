import { Detalle } from './detalle.model';

describe('Asociado', () => {
  let model: Detalle;

  beforeEach(() => {
    const bloqueContratoRes = {
      segmento: 'segmento',
      numeroDias: '3',
      personasId: ['123456']
    };
    const asociadoCabeceraRes = {
      fechaActualizacion: '2019-08-22T22:07:18.00Z',
      personas: [
        {
          telefonos: ['14567890'],
          telefonosMovil: ['987654321'],
          idPersona: '123456',
          nombrePersona: 'asdf',
          tipoDocumento: 'DNI',
          tipoPersona: 'juridica',
          numeroDocumento: '45678913',
          departamento: 'lima',
          correo: 'a@b.c',
          genero: 'masculino',
          urlFoto: 'http://goo.gl/asdf123'
        }
      ]
    };
    model = new Detalle(bloqueContratoRes, asociadoCabeceraRes);
  });

  afterEach(() => {
    model = null;
  });

  it('should create', () => {
    expect(model).toBeDefined();
  });
});
