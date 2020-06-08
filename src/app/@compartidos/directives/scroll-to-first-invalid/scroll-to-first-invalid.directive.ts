import {
  Directive,
  Input,
  ElementRef,
  ContentChildren,
  AfterContentInit,
  QueryList
} from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import * as animateScrollTo from 'animated-scroll-to';
import { Observable } from 'rxjs/Observable';

import { IErrorGroup } from './scroll-to-first-invalid.model';
import { extraerOffsetTop } from 'app/@compartidos/utils/helpers';

@Directive({
  selector: '[ginniScrollToFirstInvalid]'
})
export class ScrollToFirstInvalidDirective implements AfterContentInit {
  @Input() ginniScrollToFirstInvalid: Observable<boolean>;

  @ContentChildren(FormGroupDirective) listFormGroup: QueryList<FormGroupDirective>;
  @ContentChildren(FormGroupDirective, { read: ElementRef }) listFormGroupElement: QueryList<
    ElementRef
  >;

  constructor() {}

  ngAfterContentInit() {
    if (this.ginniScrollToFirstInvalid) {
      this.ginniScrollToFirstInvalid.subscribe(() => {
        let seScrolleo = false;
        if (this.listFormGroup) {
          this.listFormGroup.forEach((formGroupDirective, index) => {
            const formGroup = formGroupDirective.form;
            const element = this.listFormGroupElement['_results'][index].nativeElement;
            if (!formGroup.valid && !seScrolleo) {
              const target = this.getError(formGroup);
              if (element && target) {
                let nodeError;
                if (target.controlNameError) {
                  nodeError = this.getNode(element, target.controlNameError);
                }
                if (target.formGroupError) {
                  nodeError = element;
                }
                if (nodeError) {
                  const wrapper: any = document.querySelector('.nsm-overlay-open') || window;
                  animateScrollTo.default(extraerOffsetTop(nodeError) - 25, {
                    element: wrapper
                  });
                  seScrolleo = true;
                }
              }
            }
          });
        }
      });
    }
  }

  public findError(group: FormGroup): FormGroup | string {
    for (const name in group.controls) {
      if (!group.controls[name].valid) {
        const control = group.controls[name];
        if (control instanceof FormGroup) {
          if (control.errors) {
            return control;
          }
          return this.findError(control);
        } else {
          return name;
        }
      }
    }
  }

  public getError(formGroup): IErrorGroup {
    if (formGroup.errors) {
      return { formGroupError: formGroup };
    }
    const controlError = this.findError(formGroup);

    if (controlError instanceof FormGroup) {
      return { formGroupError: controlError };
    }
    if (controlError) {
      return { controlNameError: controlError };
    }
  }

  public getNode(element, name: string) {
    const controlNameData = `[formcontrolname="${name}"]`;
    if (element.querySelector) {
      return (
        element.querySelector(`input${controlNameData}`) ||
        element.querySelector(`select${controlNameData}`) ||
        element.querySelector(`ginni-select${controlNameData}`) ||
        element.querySelector(`ginni-input-date${controlNameData}`)
      );
    }
  }
}
