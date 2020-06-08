import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabbarItemComponent } from './tab-bar-item.component';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { RouterTestingModuleMockup, StoreModuleForRootTest } from 'test/utils';

describe('TabbarItemComponent', () => {
  let component: TabbarItemComponent;
  let fixture: ComponentFixture<TabbarItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CompartidosModule.forRoot(), StoreModuleForRootTest, RouterTestingModuleMockup],
      declarations: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabbarItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
