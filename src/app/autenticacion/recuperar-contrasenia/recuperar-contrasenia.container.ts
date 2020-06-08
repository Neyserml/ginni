import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { zoomAnimation } from 'app/@compartidos/animations/zoom.animation';
import { RecuperarContraseniaModel } from 'app/@compartidos/models/recuperar-contrasenia.model';
import * as store from 'app/@compartidos/store';
import { ValidationService } from 'app/@compartidos/utils/validation.service';
import { getEnviarContraseniaLoading, getEnviarContraseniaFailed } from './@store';
import * as enviarConstraseniaActions from './@store/enviar-contrasenia.action';
import { getParameterByName, createTitle } from 'app/@compartidos/utils/helpers';
import { environment } from 'environments/environment';
import { APIError } from '../../@compartidos/models';

@Component({
  selector: 'app-recuperar-contrasenia',
  templateUrl: './recuperar-contrasenia.container.html',
  styleUrls: ['./recuperar-contrasenia.container.scss'],
  animations: [zoomAnimation]
})
export class RecuperarContraseniaContainer implements OnInit {
  @ViewChild('indicador')
  indicador;

  // tslint:disable-next-line:quotemark
  public caracteresNoPermitidos = ' ';

  public enviadoRecuperarContrasenia = false;
  public mensajeError: string = null;
  public cargandoAutentinca = false;

  // form
  public formRecuperarContrasenia: FormGroup;
  public ingresarContrasenia: AbstractControl;
  public reingresarContrasenia: AbstractControl;

  // store getEnviarContraseniaLoading
  private enviarContraseniaLoading$ = this.appState$.select(getEnviarContraseniaLoading);
  private enviarContraseniaFailed$ = this.appState$.select(getEnviarContraseniaFailed);

  private subscriptions: Subscription[] = [];

  private token: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private validationService: ValidationService,
    private appState$: Store<store.State>,
    private titleService: Title
  ) {
    this.titleService.setTitle(createTitle('Recuperar contraseña'));
  }

  ngOnInit() {
    this.iniciarFormulario();
    this.registrarContrasenia();
    this.token = getParameterByName('token');
    if (!this.token && !environment.testing) {
      this.router.navigate(['/inicio-sesion']);
    }
  }

  public animarIndicador(event) {
    this.indicador.nativeElement.style.top = event.target.offsetTop + 'px';
  }

  private registrarContrasenia() {
    this.subscriptions.push(
      this.enviarContraseniaLoading$.subscribe(loading => {
        this.mensajeError = null;
        this.cargandoAutentinca = loading;
      }),
      this.enviarContraseniaFailed$.subscribe((error: APIError) => {
        if (error) {
          this.mensajeError = error.mensaje;
        }
      })
    );
  }

  iniciarFormulario() {
    this.formRecuperarContrasenia = this.fb.group(
      {
        ingresarContrasenia: ['', [Validators.required, Validators.minLength(6)]],
        reingresarContrasenia: ['', Validators.required]
      },
      {
        validator: this.validationService.matchingInputs(
          'ingresarContrasenia',
          'reingresarContrasenia'
        )
      }
    );
    const controls = this.formRecuperarContrasenia.controls;
    this.ingresarContrasenia = controls['ingresarContrasenia'];
    this.reingresarContrasenia = controls['reingresarContrasenia'];
  }

  public onSubmitRecuperar() {
    this.mensajeError = null;
    this.enviadoRecuperarContrasenia = true;
    const { valid } = this.formRecuperarContrasenia;
    if (valid) {
      const data = {
        contrasenia: this.reingresarContrasenia.value,
        token: this.token
      };
      const recuperarContraseniaModel = new RecuperarContraseniaModel(data);
      this.appState$.dispatch(new enviarConstraseniaActions.LoadAction(recuperarContraseniaModel));
    }
  }
}
