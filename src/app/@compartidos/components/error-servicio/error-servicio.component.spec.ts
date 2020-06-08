import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorServicioComponent } from './error-servicio.component';

describe('ErrorServicioComponent', () => {
  let component: ErrorServicioComponent;
  let fixture: ComponentFixture<ErrorServicioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorServicioComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
