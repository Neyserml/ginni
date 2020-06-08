import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalHeadComponent } from './modal-head.component';

describe('ModalHeadComponent', () => {
  let component: ModalHeadComponent;
  let fixture: ComponentFixture<ModalHeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalHeadComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
