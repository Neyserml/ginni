import { Location } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ViewEncapsulation,
  OnDestroy,
  OnInit
} from '@angular/core';
import * as uniqueId from 'lodash/uniqueId';
import { NgxSmartModalService } from 'ngx-smart-modal';

import { bloquearScroll, esMobile } from 'app/@compartidos/utils/helpers';

@Component({
  selector: 'ginni-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  class = '';
  @Input()
  show: boolean;
  @Input()
  dismissable = true;
  @Input()
  nativeBack: boolean;
  @Output()
  showChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public id = uniqueId();
  public init = false;

  constructor(public ngxSmartModalService: NgxSmartModalService, private location: Location) {}

  ngOnInit() {
    this.init = true;
  }

  ngOnChanges() {
    if (this.init) {
      const modal = this.ngxSmartModalService.getModal(this.id);
      if ((this.class.indexOf('modal-dialog') > -1 && esMobile()) || !this.show) {
        bloquearScroll(this.show);
      }
      if (this.show) {
        modal.open();
      } else {
        modal.close();
        document.body.className = document.body.className.replace('dialog-open', '');
      }
    }
  }

  private locationBack() {
    if (this.nativeBack) {
      this.location.back();
    }
  }

  onClose() {
    this.showChange.emit(false);
    this.locationBack();
  }

  ngOnDestroy() {
    // Fix: si el modal se queda abierto cuando cambia de pagina
    document.body.className = document.body.className.replace('dialog-open', '');
    if (this.show) {
      this.showChange.emit(false);
      this.locationBack();
    }
  }
}
