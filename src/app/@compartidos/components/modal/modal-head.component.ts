import { Component } from '@angular/core';

@Component({
  selector: 'ginni-modal-head',
  template: `
    <div class="modal__head"><ng-content></ng-content></div>
  `,
  styles: []
})
export class ModalHeadComponent {}
