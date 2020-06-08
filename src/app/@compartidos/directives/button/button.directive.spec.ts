import { ButtonDirective } from './button.directive';
import { ElementRef } from '@angular/core';

describe('ButtonDirective', () => {
  let directive: ButtonDirective;
  const el: ElementRef = {
    nativeElement: {
      scrollHeight: '1'
    }
  };

  beforeEach(() => {
    directive = new ButtonDirective(el);
  });

  afterEach(() => {
    directive = null;
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
