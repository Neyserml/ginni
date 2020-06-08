import {
  Directive,
  HostBinding,
  Input,
  ElementRef,
  AfterContentInit,
  OnChanges
} from '@angular/core';

@Directive({
  selector: '[ginniButton]'
})
export class ButtonDirective implements AfterContentInit, OnChanges {
  @HostBinding('class.ui-button')
  ui = true;

  @Input()
  color;

  @Input()
  type;

  @Input()
  buttonLoading = false;

  constructor(public el: ElementRef) {}

  ngAfterContentInit() {
    const className = this.el.nativeElement.className.split(' ');
    if (this.color) {
      className.push('ui-button-' + this.color);
    }
    if (this.type) {
      className.push(this.type);
    }
    this.el.nativeElement.className = className.join(' ');
  }

  ngOnChanges() {
    this.actualizarClaseLoading();
  }

  private actualizarClaseLoading() {
    const element = this.el.nativeElement;
    let className = element.className.split(' ');
    const classLoading = 'ui-button-loading';
    if (this.buttonLoading) {
      element.disabled = true;
      className.push(classLoading);
    } else {
      element.disabled = false;
      className = className.filter(item => item !== classLoading);
    }
    this.el.nativeElement.className = className.join(' ');
    this.el.nativeElement.blur();
  }
}
