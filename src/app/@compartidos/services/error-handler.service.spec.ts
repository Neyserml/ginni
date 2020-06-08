import { TestBed, getTestBed } from '@angular/core/testing';

import { ErrorHandlerService } from './error-handler.service';
import { LoggingErrorHandlerService } from './logging-error-handler.service';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;
  const error: Error = {
    name: 'error',
    message: 'message',
    stack: 'stack'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorHandlerService, LoggingErrorHandlerService]
    });

    const injector = getTestBed();
    service = injector.get(ErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get client message', () => {
    const message = service.getClientMessage(error);
    expect(message).toEqual(error.message);
  });

  it('should get client stack', () => {
    const message = service.getClientStack(error);
    expect(message).toEqual(error.stack);
  });

  it('should get server message', () => {
    const message = service.getServerMessage(error);
    expect(message).toEqual(error.message);
  });

  it('should get server stack', () => {
    const message = service.getServerStack(error);
    expect(message).toEqual(error.stack);
  });
});
