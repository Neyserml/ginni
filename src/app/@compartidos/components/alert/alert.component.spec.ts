import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { AlertComponent } from './alert.component';
import { NotificationTypeEnum } from '../../services/notification-type.enum';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AlertComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change', fakeAsync(() => {
    component.allowClose = true;
    component.disappear = true;
    component.show = true;
    component.ngOnChanges();
    tick(8000);
    fixture.whenStable().then(() => {
      expect(component.show).toBeFalsy();
    });
  }));

  it('should not change', fakeAsync(() => {
    component.allowClose = true;
    component.disappear = false;
    component.show = false;
    component.ngOnChanges();
    tick(5000);
    fixture.whenStable().then(() => {
      expect(component.show).toBeFalsy();
    });
  }));

  it('should get default alert type', () => {
    const type = component.getAlertType(NotificationTypeEnum.Default);
    expect(type).toEqual(NotificationTypeEnum.DefaultIcon);
  });

  it('should get danger alert type', () => {
    const type = component.getAlertType(NotificationTypeEnum.Danger);
    expect(type).toEqual(NotificationTypeEnum.DangerIcon);
  });

  it('should get info alert type', () => {
    const type = component.getAlertType(NotificationTypeEnum.Info);
    expect(type).toEqual(NotificationTypeEnum.InfoIcon);
  });

  it('should get success alert type', () => {
    const type = component.getAlertType(NotificationTypeEnum.Success);
    expect(type).toEqual(NotificationTypeEnum.SuccessIcon);
  });

  it('should get warning alert type', () => {
    const type = component.getAlertType(NotificationTypeEnum.Warning);
    expect(type).toEqual(NotificationTypeEnum.WarningIcon);
  });

  it('should get other alert type', () => {
    const type = component.getAlertType('other');
    expect(type).toEqual(NotificationTypeEnum.OtherIcon);
  });

  it('should close', () => {
    spyOn(component.close, 'emit');
    component.onClose();
    expect(component.close.emit).toHaveBeenCalledWith(false);
  });
});
