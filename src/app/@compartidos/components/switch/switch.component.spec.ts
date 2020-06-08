import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchComponent } from './switch.component';

describe('SwitchComponent', () => {
  let component: SwitchComponent;
  let fixture: ComponentFixture<SwitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SwitchComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should write value', () => {
    expect(component.form).toBeFalsy();
    expect(component.val).toBeNull();
    component.writeValue(true);
    expect(component.form).toBeTruthy();
    expect(component.val).toBeTruthy();
  });

  it('should register on change', () => {
    const change = () => {};
    component.registerOnChange(change);
    expect(component.onChangeCb).toEqual(change);
  });

  it('should register on touched', () => {
    const change = () => {};
    component.registerOnTouched(change);
    expect(component.onTouchedCb).toEqual(change);
  });

  it('should click check', () => {
    expect(component.val).toBeNull();
    expect(component.value).toBeFalsy();
    component.clickCheck();
    expect(component.val).toBeNull();
    expect(component.value).toBeTruthy();

    component.form = true;

    expect(component.val).toBeNull();
    expect(component.value).toBeTruthy();
    component.clickCheck();
    expect(component.val).toBeTruthy();
    expect(component.value).toBeTruthy();
  });
});
