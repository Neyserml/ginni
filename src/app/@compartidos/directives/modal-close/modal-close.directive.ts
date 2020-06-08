import { Directive, ElementRef, AfterContentInit } from '@angular/core';
import { ModalComponent } from 'app/@compartidos/components/modal/modal.component';

@Directive({
  selector: '[ginniModalClose]'
})
export class ModalCloseDirective implements AfterContentInit {
  constructor(private modal: ModalComponent, private el: ElementRef) {}

  ngAfterContentInit() {
    const element: HTMLElement = this.el.nativeElement;
    element.addEventListener('click', () => {
      this.modal.onClose();
    });
  }
}
