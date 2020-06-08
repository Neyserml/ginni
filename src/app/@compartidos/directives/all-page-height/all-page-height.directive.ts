import { Directive, OnDestroy, ElementRef, Input, OnInit } from '@angular/core';

import { onResizeWindow, offResizeWindow } from 'app/@compartidos/utils/helpers';

@Directive({
  selector: '[ginniAllPageHeight]'
})
export class AllPageHeightDirective implements OnInit, OnDestroy {
  @Input() ginniAllPageHeight = 0;
  @Input() addPageHeight = 0;

  windowHeight = document.documentElement.clientHeight || window.innerHeight;
  _onResizeWindow = onResizeWindow;
  _offResizeWindow = offResizeWindow;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.updateHeightSideBar();
    this._onResizeWindow(this.updateHeightSideBar);
  }

  ngOnDestroy() {
    this._offResizeWindow(this.updateHeightSideBar);
  }

  public updateHeightSideBar() {
    if (this.el) {
      setTimeout(() => {
        this.setHeightElement();
      }, 100);
      this.setHeightElement();
    }
  }

  private setHeightElement() {
    this.el.nativeElement.style.minHeight =
      this.windowHeight - 50 - this.ginniAllPageHeight + this.addPageHeight + 'px';
  }
}
