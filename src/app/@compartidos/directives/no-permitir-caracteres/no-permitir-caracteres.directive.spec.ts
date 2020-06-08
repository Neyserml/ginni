import { ElementRef } from '@angular/core';
import { ControlContainer } from '@angular/forms';

import { NoPermitirCaracteresDirective } from './no-permitir-caracteres.directive';

describe('NoPermitirCaracteresDirective', () => {
  let nativeElement;
  let directive: NoPermitirCaracteresDirective;

  beforeEach(() => {
    nativeElement = document.createElement('div');
    const elementRef: ElementRef = new ElementRef(nativeElement);
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
    directive = new NoPermitirCaracteresDirective(elementRef, parent);
    directive.formControlName = 'credit';
    directive.ginniNoPermitirCaracteres = true;
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should get form directive', () => {
    expect(directive.formDirective).toBeNull();
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
});
