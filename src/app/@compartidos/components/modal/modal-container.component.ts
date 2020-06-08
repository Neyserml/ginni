import { Component } from '@angular/core';

@Component({
  selector: 'ginni-modal-container',
  template: `
    <div class="modal-container"><ng-content></ng-content></div>
  `,
  styles: []
})
export class ModalContainerComponent {}
