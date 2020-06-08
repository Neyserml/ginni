import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RefreshApiService } from 'app/@compartidos/services/refresh-api.service';
import { TokenInterceptorService } from 'app/@compartidos/services/token-interceptor.service';
import { CatchInterceptorService } from 'app/@compartidos/services/catch-interceptor.service';

export const providersHttpInterceptors = [
  RefreshApiService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: CatchInterceptorService,
    multi: true
  }
];
