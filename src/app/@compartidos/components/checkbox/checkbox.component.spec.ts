import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxComponent } from './checkbox.component';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should click when not disabled', () => {
    spyOn(component, 'onChangeCb');
    component.clickCheck();
    expect(component.onChangeCb).toHaveBeenCalledWith(component.val);
  });

  it('should not click when disabled', () => {
    spyOn(component, 'onChangeCb');
    component.disabled = true;
    component.clickCheck();
    expect(component.onChangeCb).not.toHaveBeenCalled();
  });

  it('should write value', () => {
    expect(component.value).toBeFalsy();
    component.writeValue(true);
    expect(component.value).toBeTruthy();
  });

  it('should register on change', () => {
    spyOn(component, 'onChangeCb');
    component.registerOnChange(true);
    expect(component.onChangeCb).toBeTruthy();
  });

  it('should register on touched', () => {
    spyOn(component, 'onChangeCb');
    component.registerOnTouched(true);
    expect(component.onTouchedCb).toBeTruthy();
  });

  it('should set disabled state', () => {
    expect(component.disabled).toBeFalsy();
    component.setDisabledState(true);
    expect(component.disabled).toBeTruthy();
  });
});
