import { ElementRef } from '@angular/core';
import { SoloRegexDirective } from './solo-regex.directive';
import { FormControl } from '@angular/forms';
import { fakeAsync, tick } from '@angular/core/testing';
import { noEsValido } from 'app/@compartidos/utils/helpers';

const regexPattern = '[a-zA-Z0-9-]';

function createKeyDownEvent(config: any) {
  return new KeyboardEvent('keydown', { ...config });
}

describe('SoloRegexDirective', () => {
  let nativeElement;
  let directive: SoloRegexDirective;

  const validValue = (value, expectValue) => {
    const formControl = new FormControl(value);
    directive.ctrlRegex = formControl;
    nativeElement.value = value;
    directive.eventKeyUpDrag();
    tick(50);
    expect(noEsValido(regexPattern, true, value)).toBeTruthy();
    expect(formControl.value).toEqual(expectValue);
  };

  beforeEach(() => {
    nativeElement = document.createElement('input');
    const elementRef: ElementRef = new ElementRef(nativeElement);
    directive = new SoloRegexDirective(elementRef);
    directive.caracteres = regexPattern;
    directive.permitirCaracteres = true;
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
    expect(directive.caracteres).toEqual(regexPattern);
  });

  it('deberia validar solo los valores permitidos', () => {
    expect(noEsValido(regexPattern, true, '5')).toBeFalsy();
    expect(noEsValido(regexPattern, true, 'a')).toBeFalsy();
    expect(noEsValido(regexPattern, true, 'A')).toBeFalsy();
    expect(noEsValido(regexPattern, true, '879')).toBeFalsy();
    expect(noEsValido(regexPattern, true, '+')).toBeTruthy();
    expect(noEsValido(regexPattern, true, '?')).toBeTruthy();
    expect(noEsValido(regexPattern, true, '*')).toBeTruthy();
  });

  it('en keydown debe dejar copiar, pegar, y cortar', () => {
    expect(
      directive.eventKeyDown(
        createKeyDownEvent({
          ctrlKey: true,
          keyCode: 65
        })
      )
    ).toBeUndefined();

    expect(
      directive.eventKeyDown(
        createKeyDownEvent({
          ctrlKey: true,
          keyCode: 67
        })
      )
    ).toBeUndefined();

    expect(
      directive.eventKeyDown(
        createKeyDownEvent({
          ctrlKey: true,
          keyCode: 80
        })
      )
    ).toBeUndefined();
  });

  it('en keydown deberia prohibir el uso de "&" para el patron regexPattern', () => {
    expect(
      directive.eventKeyDown(
        createKeyDownEvent({
          key: '&'
        })
      )
    ).toBeFalsy();
  });

  it('deberia remover el valor del FormControl que no es igual al los caracteres permitidos ', fakeAsync(() => {
    validValue('*', '');
  }));

  it('deberia remover el valor del FormControl que no es igual al los caracteres permitidos ', fakeAsync(() => {
    validValue('***', '');
  }));

  it('deberia remover el valor del FormControl que no es igual al los caracteres permitidos ', fakeAsync(() => {
    validValue('**4*', '4');
  }));

  describe('caso permitirCaracteres es false', () => {
    beforeEach(() => {
      directive.permitirCaracteres = false;
    });
    it('deberia excluir los caracteres enviados', () => {
      expect(noEsValido(regexPattern, false, '5')).toBeTruthy();
      expect(noEsValido(regexPattern, false, 'a')).toBeTruthy();
      expect(noEsValido(regexPattern, false, 'A')).toBeTruthy();
      expect(noEsValido(regexPattern, false, '879')).toBeTruthy();
      expect(noEsValido(regexPattern, false, '+')).toBeFalsy();
      expect(noEsValido(regexPattern, false, '?')).toBeFalsy();
      expect(noEsValido(regexPattern, false, '*')).toBeFalsy();
    });

    it('deberia remover los valores del FormControl que son iguales al los caracteres enviados', fakeAsync(() => {
      validValue('a3*', '*');
    }));
  });
});
