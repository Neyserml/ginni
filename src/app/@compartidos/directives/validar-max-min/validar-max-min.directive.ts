import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { InBetween } from './validar-max-min.interface';

@Directive({
  selector: '[ginniValidarMaxMin]'
})
export class ValidarMaxMinDirective {
  @Input() max?: number;
  @Input() min?: number;
  @Input() pattern: string | RegExp;
  @Output() inBetween = new EventEmitter<InBetween>();
  inputElement: HTMLElement;

  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    event.preventDefault();
    this.checkOptions();
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    this.checkOptions();
  }

  @HostListener('drop', ['$event'])
  onDrop(event) {
    event.preventDefault();
    this.inputElement.focus();
    this.checkOptions();
  }

  constructor(public el: ElementRef) {
    this.inputElement = el.nativeElement;
  }

  public checkOptions(): void {
    if (this.max && this.min) {
      this.inBetween.emit(this.isInRange());
    }
  }

  public isInRange(): InBetween {
    let regExp: RegExp;
    let hPattern: boolean;
    if (this.pattern) {
      if (typeof this.pattern === 'string') {
        regExp = new RegExp('^' + this.pattern + '$', 'g');
      } else {
        regExp = this.pattern;
      }
      hPattern = regExp.test(this.el.nativeElement.value);
    } else {
      hPattern = true;
    }
    return {
      id: this.inputElement.id,
      between:
        this.el.nativeElement.value &&
        this.el.nativeElement.value.trim() !== '' &&
        Number(this.min) <= Number(this.el.nativeElement.value) &&
        Number(this.el.nativeElement.value) <= Number(this.max),
      hasPattern: hPattern
    };
  }
}
