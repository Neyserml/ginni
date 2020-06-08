import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorComponent } from './buscador.component';

xdescribe('BuscadorComponent', () => {
  let component: BuscadorComponent;
  let fixture: ComponentFixture<BuscadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BuscadorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.placeholder = 'buscar';
    component.iconText = 'icon-search';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind', () => {
    component.bindBuscador();
    expect(component).toBeTruthy();
  });
});
