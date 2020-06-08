import { ExpandDirective } from './expand.directive';
import { ElementRef } from '@angular/core';

xdescribe('ExpandDirective', () => {
  let directive: ExpandDirective;
  const el: ElementRef = {
    nativeElement: {
      scrollHeight: '1'
    }
  };

  beforeEach(() => {
    directive = new ExpandDirective(el);
  });

  afterEach(() => {
    directive = null;
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should scroll and change the height on changes', () => {
    spyOn(window.TweenLite, 'to');
    directive.ngOnChanges();
    expect(window.TweenLite.to).toHaveBeenCalledWith({ scrollHeight: '1' }, 0.5, {
      css: { height: '0px' }
    });
  });

  it('should change when ginni is expanded', () => {
    directive.ginniExpand = true;
    spyOn(window.TweenLite, 'to');
    directive.ngOnChanges();
    expect(window.TweenLite.to).toHaveBeenCalledWith(
      {
        scrollHeight: '1'
      },
      0.5,
      {
        css: {
          height: '1px'
        },
        ease: window.Bounce.easeOut
      }
    );
  });
});
