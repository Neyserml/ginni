import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrillasComponent } from './grillas.component';

describe('GrillasComponent', () => {
  let component: GrillasComponent;
  let fixture: ComponentFixture<GrillasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GrillasComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrillasComponent);
    component = fixture.componentInstance;
    component.chevron = false;
    component.columnas = [
      {
        name: 'col',
        id: 'date',
        focus: true,
        asc: false
      }
    ];
    component.tableIcon = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should click on existing columna', () => {
    component.clickEnColumna(component.columnas[0]);
    expect(component).toBeTruthy();
  });

  it('should click on not existing columna', () => {
    component.clickEnColumna({
      name: 'nod',
      id: 'time',
      focus: false,
      asc: null
    });
    expect(component).toBeTruthy();
  });
});
