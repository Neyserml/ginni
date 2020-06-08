import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaVerificacionesComponent } from './lista-verificaciones.component';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { RouterTestingModule } from '@angular/router/testing';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import { EvaluacionApiService } from 'app/modulos/logistica-vehicular/detalle/evaluacion/evaluacion-api.service';

import { StoreModuleForRootTest } from 'test/utils';

describe('ListaVerificacionesComponent', () => {
  let component: ListaVerificacionesComponent;
  let fixture: ComponentFixture<ListaVerificacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListaVerificacionesComponent],
      imports: [CompartidosModule.forRoot(), RouterTestingModule, StoreModuleForRootTest],
      providers: [PortalSandbox, EvaluacionApiService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaVerificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call desregistrar eventos on destroy', () => {
    spyOn(component as any, 'desregistrarEventos');
    component.ngOnDestroy();
    expect((component as any).desregistrarEventos).toHaveBeenCalled();
  });

  it('should call fila a eliminar on llamar servicio eliminar', () => {
    spyOn(component as any, 'llamarServicioEliminar');
    component.filaAEliminar();
    expect((component as any).llamarServicioEliminar).toHaveBeenCalled();
  });
});
