import { Injectable } from '@angular/core';

@Injectable()
export class ErrorHandlerService {
  constructor() {}

  getClientMessage(error) {
    return error.message;
  }

  getClientStack(error) {
    return error.stack;
  }

  getServerMessage(error) {
    return error.message;
  }

  getServerStack(error) {
    return error.stack;
  }
}
