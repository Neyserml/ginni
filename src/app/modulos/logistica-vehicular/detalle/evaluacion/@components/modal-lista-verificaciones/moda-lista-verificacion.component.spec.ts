import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalListaVerificacionesComponent } from './modal-lista-verificaciones.component';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { RouterTestingModule } from '@angular/router/testing';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import { EvaluacionApiService } from 'app/modulos/logistica-vehicular/detalle/evaluacion/evaluacion-api.service';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModuleForRootTest } from 'test/utils';

describe('ModalListaVerificacionesComponent', () => {
  let component: ModalListaVerificacionesComponent;
  let fixture: ComponentFixture<ModalListaVerificacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalListaVerificacionesComponent],
      imports: [
        CompartidosModule.forRoot(),
        RouterTestingModule,
        StoreModuleForRootTest,
        ReactiveFormsModule
      ],
      providers: [PortalSandbox, EvaluacionApiService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalListaVerificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
