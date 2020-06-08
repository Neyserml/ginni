import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleProgressComponent } from './circle-progress.component';

describe('CircleProgressComponent', () => {
  let component: CircleProgressComponent;
  let fixture: ComponentFixture<CircleProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CircleProgressComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set current styles on changes', () => {
    component.percent = 20;
    expect(component.currentStyles).toEqual({});
    component.ngOnChanges();
    expect(component.currentStyles).toEqual({
      transform: 'rotate(72deg)',
      borderColor: undefined
    });
  });

  it('should set font size on changes', () => {
    component.size = 100;
    component.percent = 20;
    component.ngOnChanges();
    expect(component.fontSize).toEqual('100px');
  });
});
