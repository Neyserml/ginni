import { TestBed, getTestBed } from '@angular/core/testing';
import { NotifierModule, NotifierService } from 'angular-notifier';

import { NotificationErrorHandlerService } from './notification-error-handler.service';
import { CompartidosModule } from '../compartidos.module';

describe('NotificationErrorHandlerService', () => {
  let service: NotificationErrorHandlerService;
  let notifier: NotifierService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CompartidosModule.forRoot(), NotifierModule],
      providers: [NotificationErrorHandlerService, NotifierService]
    });

    const injector = getTestBed();
    service = injector.get(NotificationErrorHandlerService);
    notifier = injector.get(NotifierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show default message', () => {
    spyOn(notifier, 'notify');
    const message = 'default';
    service.showDefault(message);
    expect(notifier.notify).toHaveBeenCalledWith('default', `${message}`);
  });

  it('should show error message', () => {
    spyOn(notifier, 'notify');
    const message = 'error';
    service.showError(message);
    expect(notifier.notify).toHaveBeenCalledWith('error', `Error: ${message}`);
  });

  it('should show info message', () => {
    spyOn(notifier, 'notify');
    const message = 'info';
    service.showInfo(message);
    expect(notifier.notify).toHaveBeenCalledWith('info', `Información: ${message}`);
  });

  it('should show success message', () => {
    spyOn(notifier, 'notify');
    const message = 'success';
    service.showSuccess(message);
    expect(notifier.notify).toHaveBeenCalledWith('success', `Éxito: ${message}`);
  });

  it('should show warning message', () => {
    spyOn(notifier, 'notify');
    const message = 'warning';
    service.showWarning(message);
    expect(notifier.notify).toHaveBeenCalledWith('warning', `Advertencia: ${message}`);
  });
});
