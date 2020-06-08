import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownComponent } from './dropdown.component';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should click on blur on toggle dropdown', () => {
    spyOn(document.body, 'addEventListener');
    expect(component.active).toBeFalsy();
    component.toggleDropdown();
    expect(component.active).toBeTruthy();
    expect(document.body.addEventListener).toHaveBeenCalledWith('click', component.onBlur);
  });

  it('should not return on blur when closest', () => {
    const $event = {
      target: {
        closest: () => true
      }
    };
    const blur = component.onBlur($event);
    expect(blur).not.toBeDefined();
  });

  it('should remove event listener on blur when not closest', () => {
    spyOn(document.body, 'removeEventListener');
    const $event = {
      target: {
        closest: () => false
      }
    };
    component.onBlur($event);
    expect(document.body.removeEventListener).toHaveBeenCalledWith('click', component.onBlur);
  });
});
