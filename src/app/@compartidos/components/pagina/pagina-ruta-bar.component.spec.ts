import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargandoComponent } from '../cargando/cargando.component';
import { PaginaRutaBarComponent } from './pagina-ruta-bar.component';
import { RouterTestingModuleMockup } from 'test/utils';

describe('PaginaRutaBarComponent', () => {
  let component: PaginaRutaBarComponent;
  let fixture: ComponentFixture<PaginaRutaBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModuleMockup],
      declarations: [PaginaRutaBarComponent, CargandoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginaRutaBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
