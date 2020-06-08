import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TextMaskModule } from 'angular2-text-mask';

import { InputDateComponent } from './input-date.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('InputDateComponent', () => {
  let component: InputDateComponent;
  let fixture: ComponentFixture<InputDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TextMaskModule, ReactiveFormsModule, FormsModule],
      declarations: [InputDateComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should write a string value', () => {
    const value = 'value';
    component.writeValue(value);
    expect(component.value).toEqual(value);
  });

  it('should assign a disable state', () => {
    component.setDisabledState(false);
    expect(component.disable).toBeFalsy();
    component.setDisabledState(true);
    expect(component.disable).toBeTruthy();
  });

  it('should change cb with date on update date', () => {
    spyOn(component, 'onChangeCb');
    const date = 'date';
    component.updateDate(date);
    expect(component.onChangeCb).toHaveBeenCalledWith('date');
  });

  it('should assign change cb on register change', () => {
    const funct = () => 'function';
    component.registerOnChange(funct);
    expect(component.onChangeCb).toEqual(funct);
  });

  it('should assign touched cb on register touched', () => {
    const funct = () => 'function';
    component.registerOnTouched(funct);
    expect(component.onTouchedCb).toEqual(funct);
  });
});
