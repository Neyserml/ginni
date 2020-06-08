import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { NotifierModule, NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs/Observable';

import { NucleoComponent } from './nucleo.component';
import { AnalyticsService } from './analytics.service';
import { State, getSesion } from 'app/@compartidos/store';
import * as sesionActions from 'app/@compartidos/store/sesion.action';
import { CookieStorage } from 'app/@compartidos/utils/storage';
import { SESION_ACTUAL } from 'app/@compartidos/utils/consts';
import { Sesion } from 'app/@compartidos/models';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { StoreModuleForRootTest } from 'test/utils';
import { SESION_RESPONSE, TOKEN } from 'test/utils.stub';

describe('NucleoComponent', () => {
  let store: Store<State>;
  let sesion$: Observable<any>;
  let component: NucleoComponent;
  let fixture: ComponentFixture<NucleoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NucleoComponent],
      imports: [
        RouterTestingModule,
        StoreModuleForRootTest,
        CompartidosModule.forRoot(),
        NotifierModule
      ],
      providers: [AnalyticsService, NotifierService]
    }).compileComponents();

    store = TestBed.get(Store);
    sesion$ = store.select(getSesion);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NucleoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('autenticar sesion', () => {
    it('deberia guardar un sesion en el store si existe en el storage', () => {
      CookieStorage.set(SESION_ACTUAL, new Sesion(SESION_RESPONSE), 1);

      component.cargarSesion();

      sesion$.subscribe((sesion: Sesion) => {
        expect(sesion.token).toEqual(TOKEN);
      });
    });
    it('deberia eliminar el sesion del storage si borras el sesion del store', () => {
      store.dispatch(new sesionActions.LogoutSuccessAction());
      component.cargarSesion();
      sesion$.subscribe(() => {
        expect(CookieStorage.get(SESION_ACTUAL)).toBeUndefined();
      });
    });
  });
});
