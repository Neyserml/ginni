import { TestBed, getTestBed } from '@angular/core/testing';

import { EvaluacionApiService } from './evaluacion-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EditarModelStub } from '../@models/editar-model.stub';
import { StoreModuleForRootTest } from 'test/utils';

describe('EvaluacionApiService', () => {
  let httpMock;
  let service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StoreModuleForRootTest],
      providers: [EvaluacionApiService]
    });

    const injector = getTestBed();
    service = injector.get(EvaluacionApiService);
    httpMock = injector.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call http post on enviar notificaciones', () => {
    spyOn((service as any).http, 'post');
    const bloqueContrato = '123456';
    const endpoint =
      (service as any).url + `/logistica/evaluacionCrediticia/enviarNotificaciones/requisitos`;
    service.enviarNotificaciones(bloqueContrato);
    expect((service as any).http.post).toHaveBeenCalledWith(endpoint, bloqueContrato);
  });

  it('should call http get on validar inicio evaluacion', () => {
    spyOn((service as any).http, 'get');
    const bloqueContrato = '123456';
    const endpoint =
      (service as any).url +
      `/logistica/evaluacionCrediticia/bloquecontrato/${bloqueContrato}/evaluacion/crediticia/validarInicio`;
    service.validarInicioEvaluacion(bloqueContrato);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http get on iniciar', () => {
    spyOn((service as any).http, 'get');
    const bloqueContrato = '123456';
    const endpoint =
      (service as any).url +
      `/logistica/evaluacionCrediticia/bloquecontrato/${bloqueContrato}/evaluacion/crediticia/iniciar`;
    service.iniciar(bloqueContrato);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http get on contratos', () => {
    spyOn((service as any).http, 'get');
    const idBloqueContrato = '123456';
    const endpoint =
      (service as any).url +
      `/logistica/evaluacionCrediticia/bloquecontrato/${idBloqueContrato}/evaluacion/crediticia/contratos`;
    service.contratos(idBloqueContrato);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http get on documentos personas', () => {
    spyOn((service as any).http, 'get');
    const idBloqueContrato = '123456';
    const endpoint =
      (service as any).url +
      `/logistica/evaluacionCrediticia/bloquecontrato/${idBloqueContrato}/evaluacion/crediticia/personas`;
    service.documentosPersonas(idBloqueContrato);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http get on buscar respaldo', () => {
    spyOn((service as any).http, 'get');
    const payload = {
      idBloqueContrato: '123456',
      numeroDocumento: '13004000',
      tipoDocumento: '18'
    };
    const endpoint =
      (service as any).url +
      `/logistica/evaluacionCrediticia/buscarPersona/tipoDocumento/${payload.tipoDocumento}/numeroDocumento/${payload.numeroDocumento}?bloqueContratoID=${payload.idBloqueContrato}`;
    service.buscarRespaldo(payload);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http get on modal lista', () => {
    spyOn((service as any).http, 'get');
    const idCreditoPersona = '13004000';
    const endpoint =
      (service as any).url +
      `/logistica/evaluacionCrediticia/persona/${idCreditoPersona}/documentos`;
    service.modalListaDocumentos(idCreditoPersona);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http delete on eliminar documentos', () => {
    spyOn((service as any).http, 'delete');
    const payload = {
      idBloqueContrato: '123456',
      idCreditoPersona: '13004000'
    };
    const endpoint =
      (service as any).url +
      `/logistica/evaluacionCrediticia/persona/${payload.idBloqueContrato}/garanteRespaldo/${payload.idCreditoPersona}/eliminar`;
    service.eliminarDocumentos(payload);
    expect((service as any).http.delete).toHaveBeenCalledWith(endpoint);
  });

  it('should call http get on modal lista documentos adicionales', () => {
    spyOn((service as any).http, 'get');
    const idCreditoPersona = '13004000';
    const endpoint =
      (service as any).url +
      `/logistica/evaluacionCrediticia/persona/${idCreditoPersona}/documentosAdicionales`;
    service.modalListaDocumentosAdicionales(idCreditoPersona);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http post on modal agregar documento', () => {
    spyOn((service as any).http, 'post');
    const idCreditoPersona = '123456';
    const file = 'file';
    const endpoint =
      (service as any).url +
      `/logistica/evaluacionCrediticia/persona/${idCreditoPersona}/documentos`;
    service.modalAgregarDocumento(idCreditoPersona, file);
    expect((service as any).http.post).toHaveBeenCalledWith(endpoint, file);
  });

  it('should call http put on modal observacion', () => {
    spyOn((service as any).http, 'put');
    const idCreditoPersona = '123456';
    const creditoObservacion = 'creditoObservacion';
    const endpoint =
      (service as any).url +
      `/logistica/evaluacionCrediticia/persona/${idCreditoPersona}/documentos`;
    service.modalObservacion(idCreditoPersona, creditoObservacion);
    expect((service as any).http.put).toHaveBeenCalledWith(endpoint, creditoObservacion);
  });

  it('should call http delete on modal eliminar archivo', () => {
    spyOn((service as any).http, 'delete');
    const payload = {
      idCreditoPersona: '123456',
      creditoPersonaDocumentoId: 'creditoObservacion'
    };
    const endpoint =
      (service as any).url +
      `/logistica/evaluacionCrediticia/persona/${payload.idCreditoPersona}/documentos/${payload.creditoPersonaDocumentoId}/archivo`;
    service.modalEliminarArchivo(payload);
    expect((service as any).http.delete).toHaveBeenCalledWith(endpoint);
  });

  it('should call http delete on modal eliminar documento', () => {
    spyOn((service as any).http, 'delete');
    const payload = {
      idCreditoPersona: '123456',
      creditoPersonaDocumentoId: 'creditoObservacion'
    };
    const endpoint =
      (service as any).url +
      `/logistica/evaluacionCrediticia/persona/${payload.idCreditoPersona}/documentos/${payload.creditoPersonaDocumentoId}`;
    service.modalEliminarDocumento(payload);
    expect((service as any).http.delete).toHaveBeenCalledWith(endpoint);
  });

  it('should call http post on agregar respaldo', () => {
    spyOn((service as any).http, 'post');
    const idBloqueContrato = '123456';
    const endpoint =
      (service as any).url +
      `/logistica/evaluacionCrediticia/bloqueContrato/${idBloqueContrato}/persona/natural`;
    const payload = EditarModelStub.personaRelacionada;
    service.agregarRespaldo(payload, idBloqueContrato);
    expect((service as any).http.post).toHaveBeenCalledWith(endpoint, payload);
  });

  it('should call http put on actualizar respaldo', () => {
    spyOn((service as any).http, 'put');
    const endpoint = (service as any).url + `/administracion/persona/natural/editarPersona`;
    const payload = EditarModelStub.personaRelacionada;
    service.actualizarRespaldo(payload);
    expect((service as any).http.put).toHaveBeenCalledWith(endpoint, payload);
  });

  it('should call http post on modal agregar opcionales', () => {
    spyOn((service as any).http, 'post');
    const payload = {
      idCreditoPersona: '123456',
      documentoId: 'creditoObservacion'
    };
    const endpoint =
      (service as any).url +
      `/logistica/evaluacionCrediticia/persona/${payload.idCreditoPersona}/agregardocumentos`;
    service.modalAgregarOpcionales(payload);
    expect((service as any).http.post).toHaveBeenCalledWith(endpoint, payload.documentoId);
  });

  it('should call http post on modal subir archivo y comentario', () => {
    spyOn((service as any).http, 'post');
    const payload = {
      idCreditoPersona: '123456',
      documentoId: 'creditoObservacion'
    };
    const endpoint =
      (service as any).url +
      `/logistica/evaluacionCrediticia/persona/${payload.idCreditoPersona}/documentos`;
    service.modalSubirArchivoYComentario(payload, payload.idCreditoPersona);
    expect((service as any).http.post).toHaveBeenCalledWith(endpoint, payload);
  });

  it('should call http post on modal descargar documento', () => {
    spyOn((service as any).http, 'post');
    const payload = {
      idCreditoPersona: '123456',
      documentoId: 'creditoObservacion'
    };
    const endpoint = (service as any).url + `/integracion/aws/documento/descargar`;
    service.modalDescargarDocumento(payload);
    expect((service as any).http.post).toHaveBeenCalledWith(endpoint, payload, {
      responseType: 'blob'
    });
  });

  it('should update estado modal on actualizar lista documentos', () => {
    const id = 'id';
    service.actualizarListaDocumentos(id);
    (service as any).estadoModalDocumentos.subscribe(documentoId => {
      expect(documentoId).toEqual(id);
    });
  });

  it('should call http get on modal validar extension y tamanio', () => {
    spyOn((service as any).http, 'get');
    const idCreditoPersona = 123456,
      tamanio = 456789,
      extension = 'extension',
      endpoint =
        (service as any).url +
        `/logistica/evaluacionCrediticia/persona/${idCreditoPersona}/documentos/validar?tamanio=${tamanio}&extension=${extension}`;
    service.modalValidarExtensionyTamanio(idCreditoPersona, tamanio, extension);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });
});
