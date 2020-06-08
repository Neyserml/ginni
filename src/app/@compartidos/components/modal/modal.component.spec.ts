import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';

import { CargandoComponent } from '../cargando/cargando.component';
import { ModalComponent } from './modal.component';
import { RouterTestingModuleMockup } from 'test/utils';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let ngxSmartModalService;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxSmartModalModule.forRoot(), RouterTestingModuleMockup],
      declarations: [ModalComponent, CargandoComponent]
    }).compileComponents();

    ngxSmartModalService = TestBed.get(NgxSmartModalService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deberia abrir el modal cuando se activa el show', () => {
    component.show = true;
    component.ngOnChanges();
    fixture.detectChanges();
    expect(ngxSmartModalService.modalStack[0].modal.visible).toBeTruthy();
  });

  it('deberia cerrar el modal cuando se desactiva el show', () => {
    component.show = false;
    component.ngOnChanges();
    fixture.detectChanges();
    expect(ngxSmartModalService.modalStack[0].modal.visible).toBeFalsy();
  });
});
