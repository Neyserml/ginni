import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiEspacioComponent } from './mi-espacio.component';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { StoreModuleForRootTest } from 'test/utils';

describe('MiEspacioComponent', () => {
  let component: MiEspacioComponent;
  let fixture: ComponentFixture<MiEspacioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModuleForRootTest, CompartidosModule.forRoot()],
      declarations: [MiEspacioComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiEspacioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
