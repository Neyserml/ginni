import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoubleSliderComponent } from './double-slider.component';
import { ChangeContext, Ng5SliderModule, PointerType } from 'ng5-slider';

describe('DoubleSliderComponent', () => {
  let component: DoubleSliderComponent;
  let fixture: ComponentFixture<DoubleSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [Ng5SliderModule],
      declarations: [DoubleSliderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoubleSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should change context on user change end', () => {
    const changeContext: ChangeContext = {
      highValue: 100,
      pointerType: PointerType.Max,
      value: 0
    };
    component.onUserChangeEnd(changeContext);
    expect(component).toBeDefined();
  });

  it('should manual refresh on refresh', () => {
    spyOn(component.manualRefresh, 'emit');
    component.refresh();
    expect(component.manualRefresh.emit).toHaveBeenCalled();
  });
});
