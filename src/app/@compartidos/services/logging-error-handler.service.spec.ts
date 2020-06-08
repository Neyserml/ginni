import { TestBed, getTestBed } from '@angular/core/testing';

import { LoggingErrorHandlerService } from './logging-error-handler.service';
import { environment } from 'environments/environment';

describe('LoggingErrorHandlerService', () => {
  let service: LoggingErrorHandlerService;
  const error: Error = {
    name: 'error',
    message: 'message',
    stack: 'stack'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggingErrorHandlerService]
    });

    const injector = getTestBed();
    service = injector.get(LoggingErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log error', () => {
    spyOn(console, 'error');
    service.logError(error.message, error.stack);
    expect(console.error).toHaveBeenCalledWith(`LoggingService: ${error.message}, ${error.stack}`);
  });

  it('should not log error', () => {
    spyOn(environment, 'production').and.returnValue(true);
    const logged = service.logError(error.message, error.stack);
    expect(logged).toEqual(`LoggingService: ${error.message}, ${error.stack}`);
  });
});
