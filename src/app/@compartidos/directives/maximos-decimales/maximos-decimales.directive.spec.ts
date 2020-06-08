import { ElementRef } from '@angular/core';

import { PrimerDigitoDiferenteDeCeroDirective } from '../primer-digito-diferente-de-cero/primer-digito-diferente-de-cero.directive';
import { ControlContainer } from '@angular/forms';

describe('PrimerDigitoDiferenteDeCeroDirective', () => {
  let nativeElement;
  let directive: PrimerDigitoDiferenteDeCeroDirective;

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
    const elementRef: ElementRef = new ElementRef(nativeElement);
    directive = new PrimerDigitoDiferenteDeCeroDirective(elementRef, parent);
    directive.ginniPrimerDigitoDiferenteDeCero = true;
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
        value: {
          match: jasmine.createSpy('match').and.returnValue(true),
          replace: () => true
        }
      },
      isTrusted: false
    };
    directive.eventKeyDown(event);
    expect(event.target.value).toBeTruthy();
  });

  it('should not reassign value on event key down', () => {
    const event = {
      target: {
        value: {
          match: jasmine.createSpy('match').and.returnValue(false),
          replace: () => true
        }
      },
      isTrusted: false
    };
    directive.eventKeyDown(event);
    expect(event.target.value).toEqual(event.target.value);
  });

  it('should update native elements value on event key up drag', () => {
    const value = '0123';
    (directive as any).el.nativeElement.value = value;
    directive.eventKeyUpDrag();
    expect((directive as any).el.nativeElement.value).toEqual('0123');
  });

  it('should not update native elements value on event key up drag', () => {
    const value = '123';
    (directive as any).el.nativeElement.value = value;
    directive.eventKeyUpDrag();
    expect((directive as any).el.nativeElement.value).toEqual(value);
  });

  it('should call event key down on key down', () => {
    spyOn(directive, 'eventKeyDown');
    const event = 'event';
    directive.onKeyDown(event);
    expect(directive.eventKeyDown).toHaveBeenCalledWith(event);
  });

  it('should not call event key down on key down', () => {
    spyOn(directive, 'eventKeyDown');
    directive.ginniPrimerDigitoDiferenteDeCero = false;
    directive.onKeyDown(event);
    expect(directive.eventKeyDown).not.toHaveBeenCalled();
  });

  it('should call event key up drag on key up', () => {
    spyOn(directive, 'eventKeyUpDrag');
    directive.onKeyUp();
    expect(directive.eventKeyUpDrag).toHaveBeenCalled();
  });

  it('should not call event key up drag on key up', () => {
    spyOn(directive, 'eventKeyUpDrag');
    directive.ginniPrimerDigitoDiferenteDeCero = false;
    directive.onKeyUp();
    expect(directive.eventKeyUpDrag).not.toHaveBeenCalled();
  });

  it('should call event key up drag on drag', () => {
    spyOn(directive, 'eventKeyUpDrag');
    directive.onDrag();
    expect(directive.eventKeyUpDrag).toHaveBeenCalled();
  });

  it('should not call event key up drag on drag', () => {
    spyOn(directive, 'eventKeyUpDrag');
    directive.ginniPrimerDigitoDiferenteDeCero = false;
    directive.onDrag();
    expect(directive.eventKeyUpDrag).not.toHaveBeenCalled();
  });

  it('should update native elements value on event key down', () => {
    const event = {
      target: {
        value: '0123'
      }
    };
    directive.eventKeyDown(event);
    expect(event.target.value).toEqual('123');
  });

  it('should not update native elements value on event key down', () => {
    const event = {
      target: {
        value: '123'
      }
    };
    directive.eventKeyDown(event);
    expect(event.target.value).toEqual(event.target.value);
  });

  it('should get form directive', () => {
    expect(directive.formDirective).toBeNull();
  });

  it('should get control name', () => {
    expect(directive.controlName).toBeUndefined();
  });
});
