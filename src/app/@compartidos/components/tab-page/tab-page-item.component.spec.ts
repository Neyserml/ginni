import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabPageItemComponent } from './tab-page-item.component';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { RouterTestingModuleMockup, StoreModuleForRootTest } from 'test/utils';

describe('TabPageItemComponent', () => {
  let component: TabPageItemComponent;
  let fixture: ComponentFixture<TabPageItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CompartidosModule.forRoot(), StoreModuleForRootTest, RouterTestingModuleMockup],
      declarations: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabPageItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change', () => {
    component.tabsPage = [{ nombre: 'name', active: true }];
    component.ngOnChanges();
    expect(component.state).toEqual({ name: true });
  });

  it('should change on click tab', () => {
    spyOn(component.tabSeleccionada, 'emit');
    const tabs = [{ nombre: 'name', active: true }];
    component.onClickChangeTab('name');
    expect(component.tabSeleccionada.emit).toHaveBeenCalledWith(tabs[0].nombre);
  });
});
