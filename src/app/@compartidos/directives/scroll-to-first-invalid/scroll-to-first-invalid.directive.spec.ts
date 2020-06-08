import { ScrollToFirstInvalidDirective } from './scroll-to-first-invalid.directive';
import { Observable } from 'rxjs/Observable';

describe('ScrollToFirstInvalidDirective', () => {
  let directive: ScrollToFirstInvalidDirective;

  beforeEach(() => {
    directive = new ScrollToFirstInvalidDirective();
    directive.ginniScrollToFirstInvalid = Observable.of(true);
  });

  afterEach(() => {
    directive = null;
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should query selector on getting node', () => {
    const name = 'node';
    const element = {
      querySelector: () => true
    };
    const controlNameData = `[formcontrolname="${name}"]`;
    spyOn(element, 'querySelector');

    directive.getNode(element, name);
    expect(element.querySelector).toHaveBeenCalledWith(`input${controlNameData}`);
    expect(element.querySelector).toHaveBeenCalledWith(`select${controlNameData}`);
    expect(element.querySelector).toHaveBeenCalledWith(`ginni-select${controlNameData}`);
    expect(element.querySelector).toHaveBeenCalledWith(`ginni-input-date${controlNameData}`);
    expect(element.querySelector).not.toHaveBeenCalledTimes(5);
  });

  it('should not query selector on getting node', () => {
    const name = 'node';
    const element = {
      querySelector: () => false
    };
    spyOn(element, 'querySelector').and.returnValue(false);

    const node = directive.getNode(name, name);
    expect(node).toBeUndefined();
    expect(element.querySelector).not.toHaveBeenCalled();
  });

  it('should validate list form group undefined when not scrolling to first invalid', () => {
    directive.ginniScrollToFirstInvalid = Observable.of(false);
    directive.ngAfterContentInit();
    expect(directive.listFormGroup).toBeUndefined();
  });
});
