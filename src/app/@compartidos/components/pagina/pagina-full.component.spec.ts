import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaFullComponent } from './pagina-full.component';
import { FooterComponent } from '../footer/footer.component';
import { SvgComponent } from '../svg/svg.component';
import { AllPageHeightDirective } from 'app/@compartidos/directives/all-page-height/all-page-height.directive';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PaginaFullComponent', () => {
  let component: PaginaFullComponent;
  let fixture: ComponentFixture<PaginaFullComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AngularSvgIconModule, HttpClientTestingModule],
      declarations: [PaginaFullComponent, AllPageHeightDirective, FooterComponent, SvgComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginaFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
