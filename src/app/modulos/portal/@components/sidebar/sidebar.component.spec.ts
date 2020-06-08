import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SidebarComponent } from './sidebar.component';
import { SidebarItemComponent } from './sidebar-item.component';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { RouterTestingModuleMockup } from 'test/utils';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, RouterTestingModuleMockup, CompartidosModule.forRoot()],
      declarations: [SidebarComponent, SidebarItemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('conversionListMenu', () => {
    it('deberia poner en un solo nivel cuando hay submenus', () => {
      component.menu = [
        {
          nombre: 'Mov.',
          submenu: [
            {
              nombre: 'Ejemplo',
              clave: 'no-existe',
              url: '/portal/pagina-en-construccion'
            }
          ]
        },
        {
          nombre: 'Ejemplo2',
          clave: 'ejemplo',
          url: '/portal/pagina-en-construccion'
        }
      ];
      component.ngOnChanges();
      expect(component.listMenus).toEqual([
        {
          nombre: 'Ejemplo',
          clave: 'no-existe',
          url: '/portal/pagina-en-construccion'
        },
        {
          nombre: 'Ejemplo2',
          clave: 'ejemplo',
          url: '/portal/pagina-en-construccion'
        }
      ]);
    });
  });
});
