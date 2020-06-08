import { Location } from '@angular/common';
import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { CargandoComponent } from 'app/@compartidos/components/cargando/cargando.component';
import { Sesion } from 'app/@compartidos/models';
import { State, getSesionState } from 'app/@compartidos/store';
import * as sesionActions from 'app/@compartidos/store/sesion.action';
import { HeaderComponent } from './@components/header/header.component';
import { ModalExpiracionComponent } from './@components/modal-expiracion/modal-expiracion.component';
import { SidebarComponent } from './@components/sidebar/sidebar.component';
import { SidebarItemComponent } from './@components/sidebar/sidebar-item.component';
import { PortalContainer } from './portal.container';
import { PortalGuard } from './portal.guard';
import { PortalSandbox } from './portal.sandbox';
import { StoreModuleForRootTest } from 'test/utils';
import { SESION_RESPONSE } from 'test/utils.stub';

export const PAGINAS_ROUTES: Routes = [
  { path: '', redirectTo: 'inicio-sesion', pathMatch: 'full' },
  { path: 'inicio-sesion', component: CargandoComponent },
  {
    path: 'portal',
    component: PortalContainer,
    canActivate: [PortalGuard],
    children: [
      { path: '', redirectTo: 'mi-espacio', pathMatch: 'full' },
      { path: 'mi-espacio', component: CargandoComponent }
    ]
  }
];

describe('PortalGuard', () => {
  let store: Store<State>;
  let location: Location;
  let router: Router;
  let sesion$: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(PAGINAS_ROUTES),
        CompartidosModule.forRoot(),
        StoreModuleForRootTest
      ],
      declarations: [
        HeaderComponent,
        SidebarComponent,
        ModalExpiracionComponent,
        PortalContainer,
        SidebarComponent,
        SidebarItemComponent
      ],
      providers: [PortalGuard, PortalSandbox]
    });

    store = TestBed.get(Store);
    sesion$ = store.select(getSesionState);

    spyOn(store, 'dispatch').and.callThrough();

    router = TestBed.get(Router);
    location = TestBed.get(Location);
  });

  it('deberia poder instanciarse', inject([PortalGuard], (guard: PortalGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('deberia prohibir el ingreso a portal', fakeAsync(() => {
    router.navigate(['/portal/mi-espacio']);
    tick();
    expect(location.path()).toEqual('/inicio-sesion');
  }));

  it('deberia permitir el ingreso a portal cuando existe sesion', fakeAsync(() => {
    store.dispatch(new sesionActions.LoadSuccessAction(new Sesion(SESION_RESPONSE)));

    sesion$.subscribe(() => {
      router.navigate(['/portal/mi-espacio']);
      tick();
      expect(location.path()).toEqual('/portal/mi-espacio');
    });
  }));
});
