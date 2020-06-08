import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { BorrarFilaComponent } from './borrar-fila.component';

describe('BorrarFilaComponent', () => {
  let component: BorrarFilaComponent;
  let fixture: ComponentFixture<BorrarFilaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BorrarFilaComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrarFilaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should set height row on on changes', () => {
    spyOn(component as any, 'setHeightRow');
    spyOn(component as any, 'translateLeftHidden');
    component.row = null;
    component.ngOnChanges();
    expect((component as any).setHeightRow).toHaveBeenCalled();
    expect((component as any).translateLeftHidden).toHaveBeenCalled();
  });

  it('should call active row on changes', () => {
    spyOn(component as any, 'activeRow');
    component.row = 1;
    component.ngOnChanges();
    expect((component as any).activeRow).toHaveBeenCalled();
  });

  it('should not call active row on changes', () => {
    spyOn(component as any, 'activeRow');
    component.estaEliminandose = true;
    component.ngOnChanges();
    expect((component as any).activeRow).not.toHaveBeenCalled();
  });

  it('should alert on mostrar mensaje alerta', () => {
    expect(component.alerta).toBeFalsy();
    component.mostrarMensajeAlerta();
    expect(component.alerta).toBeTruthy();
  });

  it('should get row selected on set height row', () => {
    spyOn(component as any, 'getRowSelected');
    component.row = 1;
    (component as any).setHeightRow();
    expect((component as any).getRowSelected).toHaveBeenCalled();
  });

  it('should not get row selected on set height row when no rows', () => {
    spyOn(component as any, 'getRowSelected');
    component.row = null;
    (component as any).setHeightRow();
    expect((component as any).getRowSelected).not.toHaveBeenCalled();
  });

  it('should set active row on resize window', () => {
    spyOn(component as any, 'activeRow');
    component.row = 1;
    ((component as any) as any).resizeWindow();
    expect((component as any).activeRow).toHaveBeenCalled();
  });

  it('should translate left without transition on resize window when no rows', () => {
    spyOn(component as any, 'translateLeftWithoutTransition');
    component.row = null;
    (component as any).resizeWindow();
    expect((component as any).translateLeftWithoutTransition).toHaveBeenCalled();
  });

  it('should not return row selectedwhen no rows are defined', () => {
    const row = (component as any).getRowSelected();
    expect(row).toBeUndefined();
  });

  it('should set height row on active row', () => {
    spyOn(component as any, 'getRowSelected').and.returnValue(true);
    spyOn(component as any, 'setHeightRow');
    (component as any).activeRow();
    expect((component as any).setHeightRow).toHaveBeenCalled();
  });

  it('should delete row on button delte row executed', fakeAsync(() => {
    spyOn(component.deleteRow, 'emit');
    spyOn(component as any, 'removeTransition');
    spyOn(component as any, 'translateLeftHidden');
    spyOn(component as any, 'setHeightRow');
    component.btnDeleteRow();
    expect(component.deleteRow.emit).toHaveBeenCalled();

    tick(500);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect((component as any).removeTransition).toHaveBeenCalled();
      expect((component as any).translateLeftHidden).toHaveBeenCalled();
      expect((component as any).setHeightRow).toHaveBeenCalled();
      expect(component.rowChange.emit).toHaveBeenCalled();
    });
  }));

  it('tests the exit button click', fakeAsync(() => {
    component.ngAfterViewInit();
    tick(500);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      spyOn(component as any, 'setHeightRow');
      expect((component as any).setHeightRow).toHaveBeenCalled();
    });
  }));
});
