import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { zoomAnimation } from 'app/@compartidos/animations/zoom.animation';
import { APIError, InicioSesionModel } from 'app/@compartidos/models';
import { RestablecerModel } from 'app/@compartidos/models/restablecer.model';
import * as store from 'app/@compartidos/store';
import * as restablecerActions from 'app/@compartidos/store/restablecer.action';
import * as sesionActions from 'app/@compartidos/store/sesion.action';
import { CARACTERES_NO_PERMITIDOS_LOGIN, SESION_ACTUAL } from 'app/@compartidos/utils/consts';
import { createTitle, getEnvironment, getVersion } from 'app/@compartidos/utils/helpers';
import { environment } from 'environments/environment';
import { CookieStorage } from 'app/@compartidos/utils/storage';

declare global {
  interface Window {
    grecaptcha: any;
    recaptchaSubmit: any;
  }
}

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.container.html',
  styleUrls: ['./inicio-sesion.container.scss'],
  animations: [zoomAnimation]
})
export class InicioSesionContainer implements OnInit, OnDestroy {
  @ViewChild('indicador')
  indicador;

  // tslint:disable-next-line:quotemark
  public caracteresNoPermitidos = CARACTERES_NO_PERMITIDOS_LOGIN; // {}^#`~[]<>/|

  public cargandoAutenticacion = false;
  public cargandoRecaptcha = false;
  public mensajeError: string = null;

  public esCuentaBloqueada = false;
  public esCuentaExpirada = false;
  public modalRecuperarClave = false;
  public recaptchaToken: string;
  private ultimoInputSeleccionado: Node;

  // Form
  public enviadoFormularioInicio = false;
  public formInicioSesion: FormGroup;
  public nombreUsuario: AbstractControl;
  public contrasenia: AbstractControl;

  public enviadoFormularioRecuperar = false;
  public formRecuperar: FormGroup;
  public recuperarUsuario: AbstractControl;

  // Store
  public sesionLoading$ = this.appState$.select(store.getSesionLoading);
  public sesionFailed$ = this.appState$.select(store.getSesionFailed);
  public restablecerLoading$ = this.appState$.select(store.getRestablecerLoading);
  public restablecerFailed$ = this.appState$.select(store.getRestablecerFailed);
  public restablecer$ = this.appState$.select(store.getRestablecer);

  public modalActualizarContrasenia = false;

  private subscriptions: Subscription[] = [];

  private desregistrarEventos() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private registrarEventos() {
    this.subscriptions.push(
      this.sesionLoading$.subscribe(() => {
        this.mensajeError = null;
      }),
      this.sesionFailed$.subscribe((error: APIError) => {
        if (error) {
          this.cargandoAutenticacion = false;
          if (error.codigo === 'ginni-001') {
            this.esCuentaBloqueada = true;
            this.modalRecuperarClave = true;
          } else if (error.codigo === 'ginni-012') {
            this.esCuentaExpirada = true;
            this.modalRecuperarClave = true;
          } else {
            this.mensajeError = error.mensaje;
          }
        }
      }),
      this.activeRouter.params.subscribe(query => {
        setTimeout(() => {
          if (!!query['clave-actualizada'] === true) {
            this.modalActualizarContrasenia = true;
            this.router.navigate(['/inicio-sesion']);
          }
        }, 0);
      })
    );
  }

  public cerrarActualizarContraseniaModal() {
    this.modalActualizarContrasenia = false;
  }

  constructor(
    private fb: FormBuilder,
    private activeRouter: ActivatedRoute,
    private router: Router,
    private appState$: Store<store.State>,
    private titleService: Title
  ) {
    this.titleService.setTitle(createTitle('Inicio sesión'));
  }

  ngOnInit() {
    // Recatpcha inicio
    const grecaptcha = window.grecaptcha;
    if (grecaptcha && grecaptcha.render) {
      grecaptcha.render('recaptcha-main');
    }

    // Si existe una sesion, desloguearlo
    CookieStorage.remove(SESION_ACTUAL);
    this.appState$.dispatch(new sesionActions.ExpireAction());

    this.iniciarFormularios();
    this.registrarEventos();
  }

  ngOnDestroy() {
    this.desregistrarEventos();
  }

  iniciarFormularios() {
    // Form Inicio Sesion
    this.formInicioSesion = this.fb.group({
      nombreUsuario: ['', Validators.required],
      contrasenia: ['', Validators.required]
    });
    const controls = this.formInicioSesion.controls;
    this.nombreUsuario = controls['nombreUsuario'];
    this.contrasenia = controls['contrasenia'];

    // Form Recuperar contraseña
    this.formRecuperar = this.fb.group({
      recuperarUsuario: ['', Validators.required]
    });
    this.recuperarUsuario = this.formRecuperar.controls['recuperarUsuario'];
  }

  public _getEnvironment = getEnvironment;
  public _getVersion = getVersion;

  public onCloseModalRecuperarClave() {
    if (this.modalRecuperarClave === false) {
      setTimeout(() => {
        this.appState$.dispatch(new restablecerActions.ResetAction());
        this.enviadoFormularioRecuperar = false;
        this.esCuentaBloqueada = false;
        this.esCuentaExpirada = false;
        this.formRecuperar.reset();
      }, 500);
    }
  }

  public onSubmitInicio(): void {
    this.mensajeError = null;
    this.enviadoFormularioInicio = true;

    setTimeout(() => {
      this.animarIndicador({ target: this.ultimoInputSeleccionado });
    }, 100);

    const { valid, value } = this.formInicioSesion;
    if (valid) {
      // Si es produccion validar con el recaptcha
      // sino lo es, entonces solo enviar el nombreUsuario y la contraseña
      if (environment.activarRecaptcha) {
        if (this.recaptchaToken) {
          this.autenticarUsuario(value, this.recaptchaToken);
        } else {
          // Extraer el token de recaptcha
          this.cargandoRecaptcha = true;
          const grecaptcha = window.grecaptcha;
          window.recaptchaSubmit = token => {
            // Cuando reciba el token, logear el usuario
            this.recaptchaToken = token;
            this.autenticarUsuario(value, token);
            this.cargandoRecaptcha = false;
          };
          grecaptcha.execute();
        }
      } else {
        this.autenticarUsuario(value, this.recaptchaToken);
      }
    }
  }

  public onSubmitRecuperar(): void {
    this.enviadoFormularioRecuperar = true;

    const { valid } = this.formRecuperar;
    if (valid) {
      this.appState$.dispatch(
        new restablecerActions.LoadAction(new RestablecerModel(this.recuperarUsuario.value))
      );
    }
  }

  public cerrarRecuperarModal() {
    this.modalRecuperarClave = false;
    this.onCloseModalRecuperarClave();
  }

  private autenticarUsuario(formValue, recaptchaToken) {
    this.cargandoAutenticacion = true;
    const inicioSesionModel = new InicioSesionModel(formValue, recaptchaToken);
    this.appState$.dispatch(new sesionActions.LoadAction(inicioSesionModel));
  }

  public animarIndicador(event) {
    const target = event.target || {};
    const position = target.offsetTop || 0;
    this.indicador.nativeElement.style.top = position + 'px';
    this.ultimoInputSeleccionado = target;
  }
}
