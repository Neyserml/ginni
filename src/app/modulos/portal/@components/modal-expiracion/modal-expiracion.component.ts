import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ginni-modal-expiracion',
  template: `
    <ginni-modal [(show)]="show" [dismissable]="false" class="modal-small">
      <ginni-modal-head title>
        <div class="modal__title-icon">
          <div class="expiracion-circle">
            <div class="expiracion-numero">{{ cuentaRegresiva }}</div>
            <svg height="100%" version="1.1" viewBox="0 0 75 75" width="100%">
              <circle
                class="fill-up"
                cx="-38"
                cy="37.5"
                fill-opacity="0"
                r="33.5"
                stroke="#8bc34a"
                stroke-dasharray="211"
                stroke-dashoffset="-211"
                stroke-width="8"
                transform="rotate(-90)"
              ></circle>
            </svg>
          </div>
        </div>
        <span class="expiracion-title">Tu sesión está por expirar</span>
      </ginni-modal-head>
      <div body>
        <p class="expiracion-text text-center">
          Por favor, presiona continuar para seguir trabajando.
        </p>
        <button
          id="btnEnviarModal"
          ginniButton
          color="primary"
          class="ui-button-block"
          type="button"
          (click)="continuarSesion.emit(true)"
        >
          Continuar
        </button>
      </div>
    </ginni-modal>
  `,
  styleUrls: ['./modal-expiracion.component.scss']
})
export class ModalExpiracionComponent implements OnInit {
  public count = 10;
  @Input()
  show: boolean;

  @Input()
  cuentaRegresiva: number;

  @Output()
  showChange: EventEmitter<boolean> = new EventEmitter();

  @Output()
  continuarSesion: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
