import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabControlComponent } from './tab-control.component';
import { TabComponent } from './tab.component';
import { TabsComponent } from './tabs.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TabControlComponent', () => {
  let component: TabControlComponent;
  let fixture: ComponentFixture<TabControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      declarations: [TabControlComponent, TabComponent, TabsComponent],
      providers: [{ provide: TabsComponent, useValue: new TabsComponent() }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('al emitirse el evento de click, deberia activar el tab', () => {
    const tab = new TabComponent();
    component.selectTab(tab);

    expect(tab.active).toBeTruthy();
  });
});
