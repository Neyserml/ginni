import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaContainerComponent } from './pagina-container.component';

describe('PaginaContainerComponent', () => {
  let component: PaginaContainerComponent;
  let fixture: ComponentFixture<PaginaContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [PaginaContainerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginaContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
