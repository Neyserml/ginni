import { Location } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIconSubtextComponent } from './modal-icon-subtext.component';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { ModalIconSubtextEnum } from './modal-icon-subtext.enum';

const locationStub = {
  key: 'value'
};

describe('ModalIconSubtextComponent', () => {
  let component: ModalIconSubtextComponent;
  let fixture: ComponentFixture<ModalIconSubtextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CompartidosModule.forRoot()],
      providers: [{ provide: Location, useValue: locationStub }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalIconSubtextComponent);
    component = fixture.componentInstance;
    component.icon = ModalIconSubtextEnum.Alert;
    component.loading = false;
    component.show = true;
    component.buttonColor = 'primary';
    component.buttonText = 'Aceptar';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
