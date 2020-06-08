import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalExpiracionComponent } from './modal-expiracion.component';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { RouterTestingModuleMockup } from 'test/utils';

describe('ModalExpiracionComponent', () => {
  let component: ModalExpiracionComponent;
  let fixture: ComponentFixture<ModalExpiracionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CompartidosModule.forRoot(), RouterTestingModuleMockup],
      declarations: [ModalExpiracionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalExpiracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
