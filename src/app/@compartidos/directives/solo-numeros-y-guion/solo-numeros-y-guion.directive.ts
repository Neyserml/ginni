import { Directive, HostListener, Input, ElementRef } from '@angular/core';
import { validarKeydown } from 'app/@compartidos/utils/helpers';

@Directive({
  selector: '[ginniSoloNumerosYGuion]'
})
export class SoloNumerosYGuionYGuionDirective {
  public _parent: any;
  public regex = /([0-9]|-)/g;

  @Input() ginniSoloNumerosYGuion = true;

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeyDown = this.eventKeyDown;

  @HostListener('paste', ['$event'])
  onPaste = (event: ClipboardEvent) => {
    if (this.ginniSoloNumerosYGuion) {
      event.preventDefault();
      const value = event.clipboardData.getData('text/plain');
      const arrayValue = value.match(this.regex);
      if (arrayValue) {
        const result = arrayValue.toString().replace(/,/g, '');
        this.el.nativeElement.value = result;
      }
    }
  };

  @HostListener('drop', ['$event'])
  onDrag = () => {
    if (this.ginniSoloNumerosYGuion) {
      this.eventKeyUpDrag();
    }
  };
  _validarKeydown = validarKeydown;

  eventKeyUpDrag() {}

  eventKeyDown(event) {
    if (this.ginniSoloNumerosYGuion) {
      this._validarKeydown('[0-9]|[-]', true, event);
    }
  }
}
