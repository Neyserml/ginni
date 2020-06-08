import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { TestBed, getTestBed } from '@angular/core/testing';
import { NotifierModule, NotifierService } from 'angular-notifier';

import { CompartidosModule } from '../compartidos.module';
import { GlobalErrorHandlerService } from './global-error-handler.service';
import { LoggingErrorHandlerService } from './logging-error-handler.service';
import { NotificationErrorHandlerService } from './notification-error-handler.service';

describe('GlobalErrorHandlerService', () => {
  let service: GlobalErrorHandlerService;
  let notification: NotificationErrorHandlerService;

  const headers = new HttpHeaders();
  const newHttpError = {
    error: '',
    headers: headers,
    status: 401,
    statusText: 'redirect',
    url: ''
  };
  const httpError = new HttpErrorResponse(newHttpError);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CompartidosModule.forRoot(), NotifierModule],
      providers: [GlobalErrorHandlerService, LoggingErrorHandlerService, NotifierService]
    });

    const injector = getTestBed();
    service = injector.get(GlobalErrorHandlerService);
    notification = injector.get(NotificationErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle http error', () => {
    spyOn(service, '_getEnvironment').and.returnValue('DEV');
    spyOn(notification, 'showError');
    service.handleError(httpError);
    expect(notification.showError).toHaveBeenCalledWith(httpError.message);
  });
});
