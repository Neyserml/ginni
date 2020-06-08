import { Directive, Input, OnChanges, ElementRef } from '@angular/core';

declare global {
  interface Window {
    TweenLite: any;
    Bounce: any;
  }
}

@Directive({
  selector: '[ginniExpand]'
})
export class ExpandDirective implements OnChanges {
  @Input() bounce = true;
  @Input() ginniExpand = false;

  constructor(public el: ElementRef) {}

  ngOnChanges() {
    const $element = this.el.nativeElement;
    if (this.ginniExpand) {
      let expand;
      if (this.bounce) {
        expand = {
          css: { height: $element.scrollHeight + 'px' },
          ease: window.Bounce.easeOut
        };
      } else {
        expand = {
          css: { height: $element.scrollHeight + 'px' }
        };
      }

      window.TweenLite.to($element, 0.5, expand);
    } else {
      window.TweenLite.to($element, 0.5, {
        css: { height: '0px' }
      });
    }
  }
}
