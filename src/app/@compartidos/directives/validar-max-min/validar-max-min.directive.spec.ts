import { ElementRef } from '@angular/core';

import { ValidarMaxMinDirective } from './validar-max-min.directive';

describe('ValidarMaxMinDirective', () => {
  let nativeElement;
  let directive;

  beforeEach(() => {
    nativeElement = document.createElement('div');
    const elementRef: ElementRef = new ElementRef(nativeElement);
    directive = new ValidarMaxMinDirective(elementRef);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should call is in range on check options', () => {
    directive.max = 2;
    directive.min = 1;
    directive.pattern = '';
    spyOn(directive.inBetween, 'emit');
    directive.checkOptions();
    expect(directive.inBetween.emit).toHaveBeenCalledWith(directive.isInRange());
  });

  it('should call is in range on check options', () => {
    spyOn(directive.inBetween, 'emit');
    directive.checkOptions();
    expect(directive.inBetween.emit).not.toHaveBeenCalled();
  });

  it('should set regExp in range from string', () => {
    spyOn(directive.inBetween, 'emit');
    directive.max = 2;
    directive.min = 1;
    directive.pattern = String('pattern');
    directive.isInRange();
    expect(directive.inBetween.emit).not.toHaveBeenCalled();
  });

  it('should set regExp in range from regExp', () => {
    spyOn(directive.inBetween, 'emit');
    directive.max = 2;
    directive.min = 1;
    directive.pattern = new RegExp(/d/);
    directive.isInRange();
    expect(directive.inBetween.emit).not.toHaveBeenCalled();
  });

  it('should call checkOptions on key up', () => {
    spyOn(directive, 'checkOptions');
    const event = new KeyboardEvent('a');
    directive.onKeyUp(event);
    expect(directive.checkOptions).toHaveBeenCalled();
  });

  it('should call checkOptions on paste', () => {
    spyOn(directive, 'checkOptions');
    const event = new ClipboardEvent('a');
    directive.onPaste(event);
    expect(directive.checkOptions).toHaveBeenCalled();
  });

  it('should call checkOptions on drop', () => {
    spyOn(directive, 'checkOptions');
    const event = new DragEvent('drag');
    directive.onDrop(event);
    expect(directive.checkOptions).toHaveBeenCalled();
  });
});
