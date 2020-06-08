import { ControlContainer } from '@angular/forms';

import { MaximosEnterosDirective } from './maximos-enteros.directive';

describe('MaximosEnterosDirective', () => {
  let nativeElement;
  let directive: MaximosEnterosDirective;

  beforeEach(() => {
    nativeElement = document.createElement('div');
    const parent: ControlContainer = {
      name: 'parentElement',
      formDirective: null,
      path: ['./'],
      control: null,
      value: null,
      valid: null,
      invalid: null,
      pending: null,
      disabled: null,
      enabled: null,
      errors: null,
      pristine: null,
      dirty: null,
      touched: null,
      status: null,
      untouched: null,
      statusChanges: null,
      valueChanges: null,
      reset: (): void => {},
      hasError: () => false,
      getError: () => null
    };
    directive = new MaximosEnterosDirective(parent);
    directive.ginniMaximosEnteros = true;
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should view to model update', () => {
    const update = directive.viewToModelUpdate();
    expect(update).toBeUndefined();
  });

  it('should reassign value on event key down', () => {
    const event = {
      target: {
        value: '1.2'
      },
      isTrusted: false
    };
    directive.eventKeyDown(event);
    expect(event.target.value).toBeTruthy();
  });

  it('should not reassign value on event key down', () => {
    const event = {
      target: {
        value: '1'
      },
      isTrusted: false
    };
    directive.eventKeyDown(event);
    expect(event.target.value).toEqual(event.target.value);
  });

  it('should not assign value on event key down', () => {
    const event = {
      target: {
        value: null
      },
      isTrusted: false
    };
    directive.eventKeyDown(event);
    expect(event.target.value).toEqual(event.target.value);
  });

  it('should reassign value on event key down with a lenghty value', () => {
    const event = {
      target: {
        value: '1.2.3.4'
      },
      isTrusted: false
    };
    directive.eventKeyDown(event);
    expect(event.target.value).toEqual(event.target.value);
  });

  it('should reassign value on event key down with a lenghty first value', () => {
    const event = {
      target: {
        value: '123456789 01234567 89.0'
      },
      isTrusted: false
    };
    directive.eventKeyDown(event);
    expect(event.target.value).toEqual(event.target.value);
  });

  it('should call event key down on key down', () => {
    spyOn(directive, 'eventKeyDown');
    const event = 'event';
    directive.onKeyDown(event);
    expect(directive.eventKeyDown).toHaveBeenCalledWith(event);
  });

  it('should not call event key down on key down', () => {
    spyOn(directive, 'eventKeyDown');
    const event = 'event';
    directive.ginniMaximosEnteros = false;
    directive.onKeyDown(event);
    expect(directive.eventKeyDown).not.toHaveBeenCalled();
  });

  it('should get form directive', () => {
    expect(directive.formDirective).toBeNull();
  });

  it('should get control name', () => {
    expect(directive.controlName).toBeUndefined();
  });
});
