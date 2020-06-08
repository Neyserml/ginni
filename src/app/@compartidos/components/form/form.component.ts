import {
  Component,
  OnChanges,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IForm } from 'app/@compartidos/interfaces/form.interface';
import { FormElement } from 'app/@compartidos/compartidos.enum';

@Component({
  selector: 'ginni-form',
  templateUrl: './form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnChanges, OnInit, OnDestroy {
  public form: FormGroup;
  public INPUT = FormElement.INPUT;
  public SELECT = FormElement.SELECT;
  public DATE = FormElement.DATE;
  public CHECKBOX = FormElement.CHECKBOX;
  public TEXT = FormElement.TEXT;

  @Input()
  public camposObligatorios = false;

  @Input()
  public datos: IForm[];

  @Input()
  public formularioEnviado: boolean;

  @Input()
  public titleMain = '';

  @Output()
  public formActual: EventEmitter<FormGroup> = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  ngOnChanges() {}

  ngOnInit() {
    this.valorAMayusculas();
    this.construirFormulario(this.datos);
    this.formActual.emit(this.form);
    this.form.valueChanges.subscribe(() => this.formActual.emit(this.form));
  }

  ngOnDestroy() {}

  private valorAMayusculas() {
    this.datos.forEach((item, index) => {
      this.datos[index].value = item.value.toString().toUpperCase();
    });
  }

  private construirFormulario(datos: IForm[]) {
    const formControls = {};

    datos.forEach((item: IForm) => {
      formControls[item.formControlName] = [item.value, item.validaciones];
    });
    this.form = this.fb.group(formControls);

    this.form.valueChanges.subscribe(() => {
      this.formActual.emit(this.form);
    });
  }

  public getControl(...ids) {
    let controls: any = this.form.controls;
    let control;
    ids.forEach(id => {
      control = controls[id];
      if (controls[id] instanceof FormGroup) {
        controls = controls[id].controls;
        return;
      }
    });
    return control;
  }

  public getControlError(...ids) {
    return this.formularioEnviado && this.getControl(...ids).errors;
  }
}
