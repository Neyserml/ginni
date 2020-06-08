import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { reducers } from 'app/modulos/logistica-vehicular/detalle/@store';
import { DetalleEffect } from 'app/modulos/logistica-vehicular/detalle/@store/detalle.effect';
import { DetalleApiService } from 'app/modulos/logistica-vehicular/detalle/detalle-api.service';
import { PersonasRelacionadasComponent } from './personas-relacionadas.component';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { ValidationService } from 'app/@compartidos/utils/validation.service';
import { PortalApiService } from 'app/modulos/portal/portal.api.service';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import { StoreModuleForRootTest, CONFIGURACION_RESPONSE } from 'test/utils';

const activatedRoute = {
  snapshot: {
    params: {
      idPersona: '123456'
    },
    data: {
      tipo: 'Dependiente'
    }
  }
};

xdescribe('PersonasRelacionadasComponent', () => {
  let component: PersonasRelacionadasComponent;
  let fixture: ComponentFixture<PersonasRelacionadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PersonasRelacionadasComponent],
      imports: [
        StoreModuleForRootTest,
        CompartidosModule.forRoot(),
        ReactiveFormsModule,
        RouterTestingModule,
        StoreModule.forFeature('asociado', reducers),
        EffectsModule.forRoot([DetalleEffect])
      ],
      providers: [
        ValidationService,
        PortalSandbox,
        PortalApiService,
        DetalleApiService,
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonasRelacionadasComponent);
    component = fixture.componentInstance;
    component.configuracion = CONFIGURACION_RESPONSE;
    component.idPersona = '123456';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
