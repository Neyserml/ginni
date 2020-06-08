import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjudicadosDetalleComponent } from './adjudicados-detalle.component';

describe('AdjudicadosDetalleComponent', () => {
  let component: AdjudicadosDetalleComponent;
  let fixture: ComponentFixture<AdjudicadosDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdjudicadosDetalleComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjudicadosDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
