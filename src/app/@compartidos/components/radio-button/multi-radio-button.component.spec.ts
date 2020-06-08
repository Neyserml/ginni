import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiRadioButtonComponent } from './multi-radio-button.component';

describe('RadioButtonComponent', () => {
  let component: MultiRadioButtonComponent;
  let fixture: ComponentFixture<MultiRadioButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MultiRadioButtonComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiRadioButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
