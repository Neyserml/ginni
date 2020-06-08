import { ElementRef } from '@angular/core';

import { SoloNumerosYGuionYGuionDirective } from './solo-numeros-y-guion.directive';

describe('SoloNumerosYGuionYGuionDirective', () => {
  let nativeElement;
  let directive: SoloNumerosYGuionYGuionDirective;

  beforeEach(() => {
    nativeElement = document.createElement('div');
    const elementRef: ElementRef = new ElementRef(nativeElement);
    directive = new SoloNumerosYGuionYGuionDirective(elementRef);
    directive.ginniSoloNumerosYGuion = true;
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should not call event key down on key down', () => {
    spyOn(directive, 'eventKeyDown');
    directive.ginniSoloNumerosYGuion = false;
    directive.onKeyDown(event);
    expect(directive.eventKeyDown).not.toHaveBeenCalled();
  });

  it('should call event key up drag on drag', () => {
    spyOn(directive, 'eventKeyUpDrag');
    directive.onDrag();
    expect(directive.eventKeyUpDrag).toHaveBeenCalled();
  });

  it('should not call event key up drag on drag', () => {
    spyOn(directive, 'eventKeyUpDrag');
    directive.ginniSoloNumerosYGuion = false;
    directive.onDrag();
    expect(directive.eventKeyUpDrag).not.toHaveBeenCalled();
  });
});
