import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ListaDocumentosComponent } from './lista-documentos.component';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { reducers } from 'app/modulos/logistica-vehicular/detalle/evaluacion/@store';
import { EvaluacionCrediticiaEffect } from 'app/modulos/logistica-vehicular/detalle/evaluacion/@store/evaluacion.effect';
import { EvaluacionApiService } from 'app/modulos/logistica-vehicular/detalle/evaluacion/evaluacion-api.service';
import { DetalleSandbox } from 'app/modulos/logistica-vehicular/detalle/detalle.sandbox';
import { PortalApiService } from 'app/modulos/portal/portal.api.service';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import { DetalleApiService } from 'app/modulos/logistica-vehicular/detalle/detalle-api.service';
import {
  CONFIGURACION_RESPONSE,
  RouterTestingModuleMockup,
  StoreModuleForRootTest
} from 'test/utils';

describe('ListaDocumentosComponent', () => {
  let component: ListaDocumentosComponent;
  let fixture: ComponentFixture<ListaDocumentosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListaDocumentosComponent],
      imports: [
        ReactiveFormsModule,
        StoreModuleForRootTest,
        RouterTestingModuleMockup,
        RouterTestingModule,
        StoreModule.forFeature('evaluacion', reducers),
        EffectsModule.forRoot([EvaluacionCrediticiaEffect]),
        CompartidosModule.forRoot()
      ],
      providers: [
        DetalleSandbox,
        EvaluacionApiService,
        PortalSandbox,
        PortalApiService,
        DetalleApiService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaDocumentosComponent);
    component = fixture.componentInstance;
    component.actualizarListaDocumentos = false;
    component.configuracion = CONFIGURACION_RESPONSE;
    component.idBloqueContrato = '123456';
    component.tipoPersona = 'Dependiente';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update indexContratoVinculadoSelected on mostrar mensaje de alerta', () => {
    expect(component.indexContratoVinculadoSelected).toBeNull();
    const index = true;
    const active = true;
    component.mostrarMensajeAlerta(index, active);
    expect(component.indexContratoVinculadoSelected).toBeTruthy();
  });

  it('should not update indexContratoVinculadoSelected on mostrar mensaje de alerta', () => {
    expect(component.indexContratoVinculadoSelected).toBeNull();
    const index = true;
    const active = false;
    component.mostrarMensajeAlerta(index, active);
    expect(component.indexContratoVinculadoSelected).toBeNull();
  });
});
