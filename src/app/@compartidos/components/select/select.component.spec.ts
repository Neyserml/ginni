import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { SelectComponent } from './select.component';
import { EMPTY } from 'app/@compartidos/utils/consts';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should assign option selected', () => {
    const ginniOption = {
      value: 12345,
      text: 'text'
    };
    component.writeValue(ginniOption);
    expect(component.optionSelected).toEqual(ginniOption);
  });

  it('should not assign option selected', () => {
    const ginniOption = {
      value: null,
      text: 'text'
    };
    component.writeValue(ginniOption);
    expect(component.optionSelected).not.toEqual(ginniOption);
  });

  it('should change cb on register on change', () => {
    const fn = (a, b) => b - a;
    component.registerOnChange(fn);
    expect(component.onChangeCb).toEqual(fn);
  });

  it('should update touched cb on register on touched', () => {
    const fn = (a, b) => b - a;
    component.registerOnTouched(fn);
    expect(component.onTouchedCb).toEqual(fn);
  });

  it('should not assign on change cb', () => {
    const fn = (a, b) => b - a;
    const changed = component.onChangeCb(fn);
    expect(changed).toBeUndefined();
  });

  it('should not assign on touched cb', () => {
    const touched = component.onTouchedCb();
    expect(touched).toBeUndefined();
  });

  it('should set disabled state', () => {
    expect(component.disabled).toBeFalsy();
    component.setDisabledState(true);
    expect(component.disabled).toBeTruthy();
  });

  it('should change cb on keyup input', () => {
    spyOn(component, 'onChangeCb');
    const value = 'Gomez';
    const ginniOption = {
      value: 1234,
      text: 'text'
    };
    component.writeValue(ginniOption);
    component.onKeyupInput(value);
    expect(component.onChangeCb).toHaveBeenCalledWith(null);
  });

  it('should assign empty to val on keyup input when no value', () => {
    spyOn(component, 'onChangeCb');
    const value = 'G';
    component.onKeyupInput(value);
    expect(component.val).toEqual(EMPTY);
  });

  it('should nullify option selected when option selected text is equal to input on key up input', () => {
    spyOn(component, 'onChangeCb');
    const value = 'Gomez';
    const ginniOption = {
      value: 1234,
      text: 'text'
    };
    component.writeValue(ginniOption);
    component.onKeyupInput(value);
    expect(component.optionSelected).toBeNull();
  });

  it('should set options to empty', () => {
    const value = 'Gomez';
    const ginniOption = {
      value: 1234,
      text: value
    };
    component.writeValue(ginniOption);
    component.onKeyupInput(value);
    expect(component.options).toEqual([]);
  });

  it('should set options to empty when texto a buscar is equal to EMPTY', () => {
    const value = EMPTY;
    const ginniOption = {
      value: 1234,
      text: value
    };
    component.writeValue(ginniOption);
    component.onKeyupInput(value);
    expect(component.options).toEqual([]);
  });

  it('should assign empty options on blur input', fakeAsync(() => {
    const value = 'Gomez';
    const ginniOption = {
      value: 1234,
      text: value
    };
    component.writeValue(ginniOption);
    component.onBlurInput();
    expect(component).toBeTruthy();

    tick(250);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.options).toEqual([]);
    });
  }));

  it('should update value with EMPTY on blur input', () => {
    spyOn(component, 'updateValue');
    component.onBlurInput();
    expect(component.updateValue).toHaveBeenCalledWith(EMPTY);
  });

  it('should change cb on click select', () => {
    spyOn(component, 'onChangeCb');
    const value = 'Gomez';
    const ginniOption = {
      value: 1234,
      text: value
    };
    component.clickSelect(ginniOption);
    expect(component.onChangeCb).toHaveBeenCalledWith(ginniOption);
  });

  it('should set empty to false', () => {
    spyOn(component, 'onChangeCb');
    const value = 'Gomez';
    const ginniOption = {
      value: 1234,
      text: value
    };
    component.finish([ginniOption]);
    expect(component.empty).toBeFalsy();
  });

  it('should set empty to true', () => {
    spyOn(component, 'onChangeCb');
    component.finish([]);
    expect(component.empty).toBeTruthy();
  });
});
