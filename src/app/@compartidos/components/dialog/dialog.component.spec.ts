import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogComponent } from './dialog.component';
import { AllPageHeightDirective } from 'app/@compartidos/directives/all-page-height/all-page-height.directive';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogComponent, AllPageHeightDirective]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should activar dialog on init', () => {
    spyOn(component, 'activarDialog');
    component.ngOnInit();
    expect(component.activarDialog).toHaveBeenCalled();
  });

  it('should activar dialog on changes', () => {
    spyOn(component, 'activarDialog');
    component.ngOnChanges();
    expect(component.activarDialog).toHaveBeenCalled();
  });

  it('should bloquear scroll on activar dialog', () => {
    spyOn(component, '_bloquearScroll');
    component.activarDialog();
    expect(component._bloquearScroll).toHaveBeenCalledWith(component.active);
  });

  it('should emit active change on close', () => {
    spyOn(component.activeChange, 'emit');
    component.onClose();
    expect(component.activeChange.emit).toHaveBeenCalledWith(false);
  });
});
