import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { DetalleApiService } from 'app/modulos/logistica-vehicular/detalle/detalle-api.service';
import { reducers } from 'app/modulos/logistica-vehicular/detalle/@store';
import { DetalleEffect } from 'app/modulos/logistica-vehicular/detalle/@store/detalle.effect';
import { InformacionPersonalComponent } from 'app/modulos/logistica-vehicular/detalle/@componentes/informacion-personal/informacion-personal.component';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { ValidationService } from 'app/@compartidos/utils/validation.service';
import { PortalApiService } from 'app/modulos/portal/portal.api.service';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import { StoreModuleForRootTest, RouterTestingModuleMockup } from 'test/utils';

xdescribe('InformacionPersonalComponent', () => {
  let component: InformacionPersonalComponent;
  let fixture: ComponentFixture<InformacionPersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CompartidosModule.forRoot(),
        StoreModuleForRootTest,
        RouterTestingModuleMockup,
        StoreModule.forFeature('asociadoAsociado', reducers)
      ],
      declarations: [InformacionPersonalComponent],
      providers: [
        PortalSandbox,
        PortalApiService,
        DetalleApiService,
        DetalleEffect,
        ValidationService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
