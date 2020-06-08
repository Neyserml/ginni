import { TestBed, getTestBed } from '@angular/core/testing';

import { RefreshApiService } from './refresh-api.service';
import { CompartidosModule } from '../compartidos.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

xdescribe('RefreshApiService', () => {
  let service: RefreshApiService;
  let httpMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CompartidosModule.forRoot(), HttpClientTestingModule],
      providers: [RefreshApiService]
    });

    const injector = getTestBed();
    service = injector.get(RefreshApiService);
    httpMock = injector.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should refresh token', () => {
    const refreshToken = 'refreshToken';
    spyOn((service as any).http, 'post');
    service.refresh({ refreshToken });
    expect((service as any).http.post).toHaveBeenCalledWith(service.url, refreshToken);
  });
});
