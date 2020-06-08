import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaEnConstruccionComponent } from './pagina-en-construccion.component';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';

describe('PaginaEnConstruccionComponent', () => {
  let component: PaginaEnConstruccionComponent;
  let fixture: ComponentFixture<PaginaEnConstruccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CompartidosModule.forRoot()],
      declarations: [PaginaEnConstruccionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginaEnConstruccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
