import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CiaDetalleComponent } from './cia-detalle.component';

describe('CiaDetalleComponent', () => {
  let component: CiaDetalleComponent;
  let fixture: ComponentFixture<CiaDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CiaDetalleComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CiaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
