import { Directive, HostListener, Input, ElementRef } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { validarEnNodoControl, validarKeydown } from 'app/@compartidos/utils/helpers';

@Directive({
  selector: '[ginniSoloRegex]'
})
export class SoloRegexDirective {
  constructor(private el: ElementRef) {}

  // Caracteres
  @Input()
  caracteres: string;

  // Cuando es true, solo aceptara los caracteres enviados
  // Cuando es false, aceptara todos los caracteres excepto los caracteres enviados
  @Input()
  permitirCaracteres: boolean;

  @Input()
  ctrlRegex: AbstractControl;

  @HostListener('keydown', ['$event'])
  onKeyDown = this.eventKeyDown;

  @HostListener('keyup', ['$event'])
  onKeyUp = this.eventKeyUpDrag;

  @HostListener('drop', ['$event'])
  onDrag = this.eventKeyUpDrag;

  eventKeyDown(event) {
    validarKeydown(this.caracteres, this.permitirCaracteres, event);
  }

  eventKeyUpDrag() {
    validarEnNodoControl(this.caracteres, this.el, this.permitirCaracteres, this.ctrlRegex);
  }
}
