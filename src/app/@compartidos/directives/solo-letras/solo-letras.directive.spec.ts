import { ElementRef } from '@angular/core';

import { SoloLetrasDirective } from './solo-letras.directive';
import { ControlContainer } from '@angular/forms';

describe('SoloLetrasDirective', () => {
  let nativeElement;
  let directive: SoloLetrasDirective;

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
    directive = new SoloLetrasDirective(elementRef, parent);
    directive.ginniSoloLetras = true;
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should view to model update', () => {
    const update = directive.viewToModelUpdate();
    expect(update).toBeUndefined();
  });

  it('should call validar key down on event key down', () => {
    spyOn(directive, '_validarKeydown');
    const event: Event = new Event('keydown');
    directive.eventKeyDown(event);
    expect(directive._validarKeydown).toHaveBeenCalled();
  });

  it('should not call validar en nodo control on event key up drag', () => {
    spyOn(directive, '_validarEnNodoControl');
    directive.eventKeyUpDrag();
    expect(directive._validarEnNodoControl).not.toHaveBeenCalled();
  });

  it('should call event key down on key down', () => {
    spyOn(directive, 'eventKeyDown');
    const event = 'event';
    directive.onKeyDown(event);
    expect(directive.eventKeyDown).toHaveBeenCalledWith(event);
  });

  it('should not call event key down on key down', () => {
    spyOn(directive, 'eventKeyDown');
    directive.ginniSoloLetras = false;
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
    directive.ginniSoloLetras = false;
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
    directive.ginniSoloLetras = false;
    directive.onDrag();
    expect(directive.eventKeyUpDrag).not.toHaveBeenCalled();
  });
});
