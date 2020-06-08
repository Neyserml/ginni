import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';

import { ErrorHandlerService } from './error-handler.service';
import { LoggingErrorHandlerService } from './logging-error-handler.service';
import { NotificationErrorHandlerService } from './notification-error-handler.service';
import { getEnvironment } from '../utils/helpers';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
  // Error handling is important and needs to be loaded first.
  // Because of this we should manually inject the services with Injector.
  _getEnvironment = getEnvironment;

  constructor(private injector: Injector) {}

  handleError(error: Error | HttpErrorResponse) {
    const errorService = this.injector.get(ErrorHandlerService);
    const logger = this.injector.get(LoggingErrorHandlerService);
    const notifier = this.injector.get(NotificationErrorHandlerService);

    let message;
    let stackTrace;
    if (this._getEnvironment() === 'DEV') {
      if (error instanceof HttpErrorResponse) {
        // Server Error
        message = errorService.getServerMessage(error);
        stackTrace = errorService.getServerStack(error);
        notifier.showError(message);
      } else {
        // Client Error
        message = errorService.getClientMessage(error);
        stackTrace = errorService.getClientStack(error);
        notifier.showError(message);
      }
      // Always log errors
      logger.logError(message, stackTrace);
    }
  }
}
