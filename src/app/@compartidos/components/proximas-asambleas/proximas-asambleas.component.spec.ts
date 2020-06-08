import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProximasAsambleasComponent } from './proximas-asambleas.component';

describe('ProximasAsambleasComponent', () => {
  let component: ProximasAsambleasComponent;
  let fixture: ComponentFixture<ProximasAsambleasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProximasAsambleasComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProximasAsambleasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
