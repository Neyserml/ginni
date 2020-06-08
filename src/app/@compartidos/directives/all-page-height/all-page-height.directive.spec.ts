import { AllPageHeightDirective } from './all-page-height.directive';
import { ElementRef } from '@angular/core';

describe('AllPageHeightDirective', () => {
  let nativeElement;
  let directive: AllPageHeightDirective;

  beforeEach(() => {
    nativeElement = document.createElement('div');
    const elementRef: ElementRef = new ElementRef(nativeElement);
    directive = new AllPageHeightDirective(elementRef);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should set height element on update height sidebar', () => {
    spyOn(directive as any, 'setHeightElement');
    directive.updateHeightSideBar();
    expect((directive as any).setHeightElement).toHaveBeenCalled();
  });

  it('should update height sidebar on init', () => {
    spyOn(directive as any, '_onResizeWindow');
    spyOn(directive as any, 'updateHeightSideBar');
    directive.ngOnInit();
    expect((directive as any).updateHeightSideBar).toHaveBeenCalled();
    expect(directive._onResizeWindow).toHaveBeenCalled();
  });

  it('should resize window on destroy', () => {
    spyOn(directive as any, '_offResizeWindow');
    directive.ngOnDestroy();
    expect(directive._offResizeWindow).toHaveBeenCalled();
  });

  it('should set height element', () => {
    directive.windowHeight = 100;
    (directive as any).setHeightElement();
    expect((directive as any).el.nativeElement.style.minHeight).toEqual('50px');
  });
});
