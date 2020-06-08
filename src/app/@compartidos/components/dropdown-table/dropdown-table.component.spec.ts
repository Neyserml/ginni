import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownTableComponent } from './dropdown-table.component';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';

describe('DropdownTableComponent', () => {
  let component: DropdownTableComponent;
  let fixture: ComponentFixture<DropdownTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CompartidosModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownTableComponent);
    component = fixture.componentInstance;
    component.class = '';
    component.show = true;
    component.title = '';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle active', () => {
    expect(component.activated).toBeFalsy();
    component.toggleActive();
    expect(component.activated).toBeTruthy();
  });
});
