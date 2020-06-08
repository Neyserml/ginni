import {
  Component,
  ViewChild,
  OnInit,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import { offResizeWindow, onResizeWindow } from 'app/@compartidos/utils/helpers';

@Component({
  selector: 'ginni-borrar-fila',
  template: `
    <div #mensajeAlerta class="borrar-contrato" [ngClass]="{ alerta: alerta }">
      <div class="borrar-contrato-contenedor  flex space-between flex-middle-center">
        <span>
          <span class="icon-x" (click)="rowChange.emit(null)"></span>
          <span class="borrar-mensaje"><ng-content></ng-content></span>
        </span>
        <div>
          <button
            body
            ginniButton
            class="ui-button-min-width ui-button-small ui-button-no-hover"
            color="white__color-red"
            (click)="btnDeleteRow()"
          >
            {{ btnText }}
          </button>
          <button
            body
            ginniButton
            class="ui-button-min-width ui-button-small ui-button-no-hover cancel-button"
            color="red"
            (click)="rowChange.emit(null)"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./borrar-fila.scss']
})
export class BorrarFilaComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  public alerta = false;

  @ViewChild('mensajeAlerta')
  $mensajeAlerta;

  @Output()
  deleteRow = new EventEmitter();

  @Input()
  row: number = null;

  @Input()
  rowCancel: boolean;

  @Output()
  rowChange = new EventEmitter();

  @Input()
  btnText = 'Eliminar';

  @Input()
  visor: boolean;

  public estaEliminandose = false;

  ngOnInit() {
    onResizeWindow(this.resizeWindow);
    this.translateLeftWithoutTransition();
    if (this.rowCancel) {
      this.rowChange.emit(null);
    }
  }

  ngOnChanges() {
    const $mensajeAlertaElement = this.$mensajeAlerta.nativeElement;
    if (!this.estaEliminandose && $mensajeAlertaElement.parentNode.parentElement) {
      if (this.row === null) {
        this.translateLeftHidden();
        this.setHeightRow();
      } else {
        this.activeRow();
      }
    }

    if (this.rowCancel) {
      this.rowChange.emit(null);
    }
  }

  ngOnDestroy() {
    offResizeWindow(this.resizeWindow);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.setHeightRow();
    }, 500);
  }

  btnDeleteRow() {
    const $mensajeAlertaElement = this.$mensajeAlerta.nativeElement;
    $mensajeAlertaElement.style.height = '0px';
    this.estaEliminandose = true;
    this.deleteRow.emit();
    setTimeout(() => {
      this.estaEliminandose = false;
      this.removeTransition();
      this.translateLeftHidden();
      this.setHeightRow();
      this.rowChange.emit(null);
    }, 300);
  }

  mostrarMensajeAlerta() {
    this.alerta = true;
  }

  private activeRow() {
    const $mensajeAlertaElement = this.$mensajeAlerta.nativeElement;
    const $row = this.getRowSelected();
    this.setHeightRow();

    if ($row) {
      if (this.visor) {
        $mensajeAlertaElement.style.bottom = 0 + 'px';
        $mensajeAlertaElement.style.paddingBottom = '0';
        $mensajeAlertaElement.style.paddingTop = '0';
        $mensajeAlertaElement.style.paddingLeft = '.9rem';
        $mensajeAlertaElement.style.paddingRight = '.9rem';
      } else {
        $mensajeAlertaElement.style.top = $row.offsetTop + 'px';
        $mensajeAlertaElement.style.left = '0px';
      }
    }
  }

  private getRowSelected(): HTMLElement {
    const $mensajeAlertaElement = this.$mensajeAlerta.nativeElement;
    const $wrapper = $mensajeAlertaElement.parentNode.parentElement;
    if ($wrapper) {
      const $rowAll = $wrapper.querySelectorAll('tbody tr');
      const $rowItemAll = $wrapper.querySelectorAll('.row-item');
      if ($rowAll.length) {
        return this.row ? $rowAll[this.row] : $rowAll[0];
      }
      if ($rowItemAll.length) {
        return this.row ? $rowItemAll[this.row] : $rowItemAll[0];
      }
    }
  }

  private removeTransition() {
    const $mensajeAlertaElement = this.$mensajeAlerta.nativeElement;
    $mensajeAlertaElement.style.transitionDuration = '0s';
    $mensajeAlertaElement.style.webkitTransitionDuration = '0s';
  }

  private resizeWindow = () => {
    if (this.row === null) {
      this.translateLeftWithoutTransition();
    } else {
      this.activeRow();
    }
  };

  private setHeightRow() {
    if (this.row !== null) {
      const $mensajeAlertaElement = this.$mensajeAlerta.nativeElement;
      const $rowSelected = this.getRowSelected();
      let height: number;

      if (!$rowSelected) {
        return;
      }

      if ($rowSelected.className.indexOf('row-item') > -1) {
        height = $rowSelected.offsetHeight > 60 ? 60 : $rowSelected.offsetHeight;
      } else {
        height = $rowSelected.clientHeight > 53 ? 53 : $rowSelected.clientHeight;
      }
      $mensajeAlertaElement.style.height = height + 'px';

      $mensajeAlertaElement.style.transitionDuration = '';
      $mensajeAlertaElement.style.webkitTransitionDuration = '';
    }
  }

  private translateLeftHidden() {
    const $mensajeAlertaElement = this.$mensajeAlerta.nativeElement;
    const clientWidth = $mensajeAlertaElement.clientWidth;
    if (clientWidth) {
      $mensajeAlertaElement.style.height = '0px';
    }
  }

  private translateLeftWithoutTransition = () => {
    this.removeTransition();
    this.translateLeftHidden();
  };
}
