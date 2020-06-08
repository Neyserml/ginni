import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { IngresosComponent } from 'app/modulos/logistica-vehicular/detalle/@componentes/ingresos/ingresos.component';
import { ArrayProp } from 'app/@compartidos/models/prop.interface';
import * as store from 'app/@compartidos/store';
import { Configuracion } from 'app/modulos/portal/@models/configuracion.model';
import * as AsociadoAction from 'app/modulos/logistica-vehicular/detalle/@store/detalle.action';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import { getPersonalYConfiguracion } from 'app/modulos/logistica-vehicular/detalle/@store';
import { TiposPersona, CONVIVIENTE, CASADO } from '../detalle.enum';
import { TipoBandeja } from '../../bandejas/bandejas.enum';
import { getPersonal } from 'app/modulos/logistica-vehicular/detalle/@store/index';

@Component({
  selector: 'ginni-editar-asociado',
  templateUrl: './editar-asociado.component.html',
  styleUrls: ['./editar-asociado.component.scss']
})
export class EditarAsociadoComponent implements OnInit, OnDestroy {
  @ViewChild(IngresosComponent) ingresos: IngresosComponent;

  public accesoEditar: boolean;
  public idPersona;
  public idEstadoCivilPersona: string;
  public tipoPersona: TiposPersona.NATURAL | TiposPersona.JURIDICO;
  public estadosCiviles: ArrayProp;
  public idEstadoCivil: number;
  public mostrarPersonasRelacionadas: boolean;

  // Observadores
  public personalYConfiguracion$ = this.appState$.select(getPersonalYConfiguracion);
  public personal$ = this.appState$.select(getPersonal);

  // Persona Relacionada
  public personaRelacionada = true;
  public informacionPersonaRelacionada = false;

  public subscriptions: Subscription[] = [];

  public configuracion: Configuracion;

  constructor(
    public eleRef: ElementRef,
    public portalSandbox: PortalSandbox,
    private activatedRoute: ActivatedRoute,
    private appState$: Store<store.State>
  ) {}

  public get esTipoNatural() {
    return this.tipoPersona ? this.tipoPersona === TiposPersona.NATURAL : false;
  }

  public get esTipoJuridico() {
    return this.tipoPersona ? this.tipoPersona === TiposPersona.JURIDICO : false;
  }

  public get tituloInformacionPersonal() {
    if (this.esTipoNatural) {
      return 'Información personal';
    } else {
      return 'Información del asociado';
    }
  }

  public ngOnInit() {
    this.accesosEditar();
    this.idPersona = this.activatedRoute.snapshot.params['idPersona'];
    window.scroll(0, 0);
    this.registrarEventos();

    this.tipoPersona = this.activatedRoute.snapshot.data.tipo;
    setTimeout(() => {
      this.clickOnIngreso();
    }, 2000);
  }

  public ngOnDestroy(): void {
    this.desregistrarEventos();
  }

  private accesosEditar() {
    const bandeja = localStorage.getItem('bandeja');
    if (bandeja && bandeja === TipoBandeja.Aprobados) {
      this.accesoEditar = false;
    } else {
      const { accesoEditar } = this.portalSandbox.getRestriccion();
      this.accesoEditar = accesoEditar;
    }
  }

  public registrarEventos() {
    this.subscriptions.push(
      this.personalYConfiguracion$.subscribe(({ configuracion, personal }) => {
        if (configuracion && !this.configuracion) {
          this.configuracion = configuracion;
          this.estadosCiviles = configuracion.estadoCivil;
        }
        if (this.esTipoNatural) {
          if (personal && personal.idEstadoCivil) {
            const esCasadoOConviviente = this.validarEsCasadoOConviviente(
              personal.idEstadoCivil.toString()
            );
            this.mostrarPersonasRelacionadas = esCasadoOConviviente;
          }
        } else if (this.esTipoJuridico) {
          this.mostrarPersonasRelacionadas = true;
        }
      }),
      this.personal$.subscribe(personal => {
        if (personal) {
          this.idEstadoCivilPersona = personal.idEstadoCivil;
        }
      })
    );
  }

  private validarEsCasadoOConviviente(idEstadoCivil) {
    const claveCasado = this.configuracion.estadoCivil.getClave(CASADO);
    const claveConviviente = this.configuracion.estadoCivil.getClave(CONVIVIENTE);
    return idEstadoCivil === claveCasado || idEstadoCivil === claveConviviente;
  }

  public agregarIngreso(event) {
    this.ingresos.nuevoIngreso(event);
    this.clickOnIngreso();
  }

  private clickOnIngreso() {
    const smallBox = this.eleRef.nativeElement.querySelector('#tipo-natural');
    if (smallBox) {
      smallBox.dispatchEvent(new Event('click'));
    }
  }

  private desregistrarEventos() {
    this.appState$.dispatch(new AsociadoAction.ResetAction());
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
