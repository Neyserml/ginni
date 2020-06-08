import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';

import { DropdownComponent } from '../dropdown/dropdown.component';
import { collapseInDownAnimation } from 'app/@compartidos/animations/collapseInDown.animation';

@Component({
  selector: 'ginni-dropdown-table',
  templateUrl: './dropdown-table.component.html',
  animations: [collapseInDownAnimation],
  styleUrls: ['./dropdown-table.component.scss']
})
export class DropdownTableComponent implements OnInit {
  @ViewChild(DropdownComponent) dropDown: DropdownComponent;
  @Input() class: string;
  @Input() longText: boolean;
  @Input() disabled: boolean;
  @Input() show: boolean;
  @Input() title: string;
  @Input() activated = false;

  constructor(private eRef: ElementRef) {}

  ngOnInit() {}

  @HostListener('document:click', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  handleOutsideClick(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      if (!this.disabled) {
        this.activated = false;
        if (this.dropDown) {
          this.dropDown.active = false;
        }
      }
    }
  }

  public toggleActive(): void {
    if (!this.disabled) {
      this.activated = !this.activated;
      if (this.dropDown) {
        this.dropDown.active = this.activated;
      }
    }
  }
}
