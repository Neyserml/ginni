import { TestBed, inject } from '@angular/core/testing';
import { GeneracionContratoGuard } from './generacion-contrato.guard';

describe('GeneracionContratoGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeneracionContratoGuard]
    });
  });

  it('should ...', inject([GeneracionContratoGuard], (guard: GeneracionContratoGuard) => {
    expect(guard).toBeTruthy();
  }));
});
