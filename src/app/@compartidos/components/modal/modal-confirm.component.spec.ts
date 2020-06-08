import { Location } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmComponent } from './modal-confirm.component';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { ModalConfirmEnum } from './modal-confirm.enum';

const locationStub = {
  key: 'value'
};

describe('ModalConfirmComponent', () => {
  let component: ModalConfirmComponent;
  let fixture: ComponentFixture<ModalConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CompartidosModule.forRoot()],
      providers: [{ provide: Location, useValue: locationStub }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmComponent);
    component = fixture.componentInstance;
    component.show = true;
    component.backColor = ModalConfirmEnum.Primary;
    component.backText = 'Cancelar';
    component.goColor = ModalConfirmEnum.Dark;
    component.goText = 'Aceptar';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
