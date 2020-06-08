import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ginni-dropdown-option',
  template: `
    <p><ng-content></ng-content></p>
  `,
  styles: [
    `
      :host:first-child p {
        border-top: 0px solid;
      }

      p {
        padding: 5px 10px;
        border-top: 1px solid #c1c1c1;
      }
      p:hover {
        background-color: #f5f5f5;
      }
    `
  ]
})
export class DropdownOptionComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
