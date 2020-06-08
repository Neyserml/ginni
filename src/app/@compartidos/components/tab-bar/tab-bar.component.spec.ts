import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabBarComponent } from './tab-bar.component';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { RouterTestingModuleMockup, StoreModuleForRootTest } from 'test/utils';

describe('TabBarComponent', () => {
  let component: TabBarComponent;
  let fixture: ComponentFixture<TabBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CompartidosModule.forRoot(), StoreModuleForRootTest, RouterTestingModuleMockup],
      declarations: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabBarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should registrar eventos on init', () => {
    spyOn(component as any, 'registrarEventos');
    component.ngOnInit();
    expect((component as any).registrarEventos).toHaveBeenCalled();
  });

  it('should registrar eventos', () => {
    spyOn((component as any).subscriptions, 'push');
    (component as any).registrarEventos();
    expect((component as any).subscriptions.push).toHaveBeenCalled();
  });
});
