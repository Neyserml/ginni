import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeyendaComponent } from './leyenda.component';

describe('LeyendaComponent', () => {
  let component: LeyendaComponent;
  let fixture: ComponentFixture<LeyendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [LeyendaComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeyendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.listarLeyenda = [
      {
        clave: 'day',
        valor: 'sunday'
      },
      {
        clave: 'day',
        valor: 'monday'
      },
      {
        clave: 'day',
        valor: 'tuesday'
      },
      {
        clave: 'day',
        valor: 'wednesday'
      }
    ];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should obtener leyenda', () => {
    expect(component.obtenerLeyenda).toEqual([
      [
        {
          clave: 'day',
          valor: 'sunday'
        },
        {
          clave: 'day',
          valor: 'monday'
        },
        {
          clave: 'day',
          valor: 'tuesday'
        },
        {
          clave: 'day',
          valor: 'wednesday'
        }
      ]
    ]);
  });
});
