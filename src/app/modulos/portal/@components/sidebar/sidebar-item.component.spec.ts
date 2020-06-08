import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModuleMockup } from 'test/utils';

import { SidebarItemComponent } from './sidebar-item.component';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';

describe('SidebarItemComponent', () => {
  let component: SidebarItemComponent;
  let fixture: ComponentFixture<SidebarItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, RouterTestingModuleMockup, CompartidosModule.forRoot()],
      declarations: [SidebarItemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call inner width on collapsar sidebar', () => {
    spyOn(window, 'innerWidth').and.returnValue(1024);
    const innerWidth = (component as any).collapsarSidebar();
    expect(innerWidth).toBeFalsy();
  });

  it('should collapsar sidebar on change show toggle', () => {
    spyOn(component as any, 'collapsarSidebar');
    component.disabled = false;
    component.changeShowToggle('active');
    expect((component as any).collapsarSidebar).toHaveBeenCalled();
    expect(component.showToggle).toEqual('inactive');
  });

  it('should show change toggle', () => {
    spyOn(component as any, 'collapsarSidebar').and.returnValue(true);
    component.disabled = false;
    component.changeShowToggle('active');
    expect(component.showToggle).toEqual('active');
  });

  it('should not show change toggle', () => {
    spyOn(component as any, 'collapsarSidebar').and.returnValue(true);
    component.disabled = true;
    component.changeShowToggle('active');
    expect((component as any).collapsarSidebar).not.toHaveBeenCalled();
  });
});
