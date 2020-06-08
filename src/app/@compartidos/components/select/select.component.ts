import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnInit,
  forwardRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { fadeInDownAnimation } from 'app/@compartidos/animations/fadeInDown.animation';
import { EMPTY } from 'app/@compartidos/utils/consts';

export interface IGinniOption {
  value: number;
  text: string;
  idPersona?: number;
}

export interface IGinniSelectLoadEvent {
  value: string;
  finish: (optionsComponent: IGinniOption[]) => void;
}

@Component({
  selector: 'ginni-select',
  templateUrl: './select.component.html',
  animations: [fadeInDownAnimation],
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements OnInit, ControlValueAccessor {
  @ViewChild('input')
  inputElement;

  public val = EMPTY;

  public limpiarCargoOcupacion = false;

  @Output()
  public loadOptions: EventEmitter<IGinniSelectLoadEvent> = new EventEmitter();

  public cargando = false;

  public empty = false;

  @Input()
  public class: string;

  @Input()
  public disabled = false;

  public options: IGinniOption[] = [];

  @Output()
  public selected = new EventEmitter();

  public optionSelected: IGinniOption;

  onChangeCb = (_: any): void => {};
  onTouchedCb = (): void => {};

  writeValue(option: IGinniOption): void {
    if (option && option.value) {
      this.optionSelected = option;
      this.inputElement.nativeElement.value = option.text;
    } else {
      this.inputElement.nativeElement.value = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeCb = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit() {
    const input$ = this.inputElement.nativeElement;

    const mapValue = (event: any) => {
      if (event.currentTarget || event.currentTarget === '') {
        const target = event.currentTarget || event.target;

        return target.value;
      }
    };

    const $inputKeyUp = Observable.fromEvent(input$, 'keyup')
      .map(mapValue)
      .debounceTime(500);

    input$.addEventListener('paste', event => {
      let value;
      if (event.clipboardData) {
        const clipboardData = event.clipboardData;
        value = clipboardData.getData('text');
      } else {
        value = event;
      }
      setTimeout(() => {
        this.onKeyupInput(mapValue(value));
      }, 100);
    });

    $inputKeyUp.subscribe(this.onKeyupInput);
  }

  public onKeyupInput = value => {
    if (value) {
      const textoABuscar = value.trim();
      if (textoABuscar.length > 2 || textoABuscar.length === 0) {
        this.val = textoABuscar;
        if (
          !this.optionSelected ||
          (this.optionSelected && this.optionSelected.text !== textoABuscar)
        ) {
          this.optionSelected = null;
          this.onChangeCb(null);
          this.selected.emit(null);
        }
        this.empty = false;
        this.cargando = false;
        if (textoABuscar !== EMPTY) {
          this.cargando = true;
          this.loadOptions.emit({ value: textoABuscar, finish: this.finish });
        } else {
          this.options = [];
        }
      } else {
        this.val = EMPTY;
        this.optionSelected = null;
        this.onChangeCb(null);
        this.selected.emit(null);
      }
    }
  };

  public finish = (optionsComponent: IGinniOption[]) => {
    this.cargando = false;
    if (optionsComponent.length) {
      this.empty = false;
      this.options = optionsComponent.slice();
    } else {
      this.empty = true;
    }
  };

  public onBlurInput() {
    if (!this.optionSelected) {
      this.updateValue(EMPTY);
      this.empty = false;
    }
    setTimeout(() => {
      this.options = [];
    }, 250);
  }

  public clickSelect(optionComponent: IGinniOption) {
    if (optionComponent) {
      this.updateValue(optionComponent.text);
      this.selected.emit(optionComponent);
      this.onChangeCb(optionComponent);
      this.optionSelected = optionComponent;
    }
  }

  public updateValue(value) {
    this.val = value;
    this.inputElement.nativeElement.value = value;
  }
}
