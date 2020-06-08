import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxGroupComponent } from './checkbox-group.component';
import { CheckboxComponent } from './checkbox.component';

describe('CheckboxGroupComponent', () => {
  let component: CheckboxGroupComponent;
  let fixture: ComponentFixture<CheckboxGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxGroupComponent, CheckboxComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add checkbox', () => {
    const checkbox = new CheckboxComponent();
    expect(component.checkboxes.length).toEqual(0);
    component.addCheckbox(checkbox);
    expect(component.checkboxes.length).toEqual(1);
    component.addCheckbox(checkbox);
    expect(component.checkboxes.length).toEqual(2);
  });

  it('should click checkbox', () => {
    component.checkboxes = [
      { label: 'A4', value: true },
      { label: 'B2', value: true },
      { label: 'C1', value: true }
    ];
    spyOn(component.valueChange, 'emit');
    const label = 'A4';
    component.clickCheckbox(label);
    expect(component.valueChange.emit).toHaveBeenCalledWith([
      { label: 'A4', value: false },
      { label: 'B2', value: true },
      { label: 'C1', value: true }
    ]);
  });
});
