import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsComponent } from './tabs.component';
import { TabComponent } from './tab.component';
import { TabControlComponent } from './tab-control.component';
import { TestTabComponent } from './mockup/test-tab.component.spec';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TabsComponent', () => {
  let tabComponent: TabsComponent;
  let tabControlComponent: TabControlComponent;
  let fixture: ComponentFixture<TestTabComponent>;
  let tabFirst: TabComponent;
  let tabLast: TabComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      declarations: [TestTabComponent, TabsComponent, TabComponent, TabControlComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTabComponent);
    const nodeChildren = fixture.debugElement.children[0];
    tabComponent = nodeChildren.componentInstance;
    tabControlComponent = nodeChildren.children[0].componentInstance;
    fixture.detectChanges();
    tabFirst = tabComponent.tabs.first;
    tabLast = tabComponent.tabs.last;
    tabFirst.active = false;
    tabLast.active = false;
  });

  it('should create', () => {
    expect(tabComponent).toBeTruthy();
  });

  it('si selecciono un tab deberia poder actualizar al respectivo', () => {
    tabControlComponent.selectTab(tabFirst);

    expect(tabFirst.active).toBeTruthy();
    expect(tabLast.active).toBeFalsy();
  });
});
