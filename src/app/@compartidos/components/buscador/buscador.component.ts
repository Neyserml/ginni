import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ginni-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.scss']
})
export class BuscadorComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  public onlyContract = false;

  @Input()
  public iconText: string;

  @Input()
  public disabled: boolean;

  @Input()
  public placeholder: string;

  @Input()
  public maxLength: string;

  @Output()
  public textoABuscar: EventEmitter<string> = new EventEmitter();

  @ViewChild('buscador') buscador: ElementRef;

  ngOnInit() {
    this.bindBuscador();
  }

  ngOnChanges() {
    if (this.maxLength) {
      this.buscador.nativeElement.setAttribute('maxLength', this.maxLength);
    } else {
      this.buscador.nativeElement.setAttribute('maxLength', '');
    }
  }

  ngOnDestroy() {
    this.buscador.nativeElement.removeAttribute('maxLength');
    this.maxLength = null;
  }

  public bindBuscador() {
    const buscadorElement = this.buscador.nativeElement;
    const mapValue = (event: any) => {
      if (event.currentTarget || event.currentTarget === '') {
        return event.currentTarget.value || event.target.value;
      }
    };

    const registerBuscador = (value: string) => {
      let validValue;
      if (this.onlyContract) {
        validValue = value.replace(/[^0-9\-]/g, '');
      } else {
        validValue = value;
      }
      if (validValue) {
        const textoABuscar = value ? value.trim() : buscadorElement.value.trim();
        if (textoABuscar) {
          if (textoABuscar.length > 2 || textoABuscar.length === 0) {
            this.textoABuscar.emit(textoABuscar);
          }
        }
      } else {
        this.textoABuscar.emit('');
      }
    };

    const $inputKeyUp = Observable.fromEvent(buscadorElement, 'keyup')
      .map(mapValue)
      .debounceTime(500);

    buscadorElement.addEventListener('paste', event => {
      setTimeout(() => {
        const value = event.target.value;
        registerBuscador(value);
      }, 400);
    });

    $inputKeyUp.subscribe(registerBuscador);
  }
}
