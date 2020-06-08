import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckStatusReactivacionesComponent } from './check-status-reactivaciones.component';

describe('CheckStatusReactivacionesComponent', () => {
  let component: CheckStatusReactivacionesComponent;
  let fixture: ComponentFixture<CheckStatusReactivacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckStatusReactivacionesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckStatusReactivacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
