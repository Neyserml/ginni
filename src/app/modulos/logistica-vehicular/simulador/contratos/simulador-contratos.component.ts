import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { LISTA_COLUMNAS_CONTRATOS } from '../simulador.enum';
import { cloneArray } from 'app/@compartidos/utils/helpers';
import { IListaContratosSimulador } from '../@interfaces/simulador.interface';
import { formatoMonedaSinSimbolo, formatoMoneda } from 'app/@compartidos/utils/helpers';
import { SimuladorApiService } from '../simulador-api.service';
import * as store from 'app/@compartidos/store';
import { APIError } from 'app/@compartidos/models';
import { NotifierService } from 'angular-notifier';
import * as listarContratosActions from '../@store/listar-contratos.action';
import { Store } from '@ngrx/store';
import { NotificationTypeEnum } from 'app/@compartidos/services/notification-type.enum';

@Component({
  selector: 'ginni-simulador-contratos',
  templateUrl: './simulador-contratos.component.html'
})
export class SimuladorContratosComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  listaContratos: IListaContratosSimulador[];

  @Output()
  simular: EventEmitter<IListaContratosSimulador[]> = new EventEmitter();

  @Output()
  seleccionandoContrato: EventEmitter<boolean> = new EventEmitter();

  public errorContratos: string;
  public _formatoMonedaSinSimbolo = formatoMonedaSinSimbolo;
  public _formatoMoneda = formatoMoneda;
  public listaColumnas = cloneArray(LISTA_COLUMNAS_CONTRATOS);
  public loading: boolean;
  public typeAlert: string;
  public totalValorSeleccionados: number;
  public primeraSeleccion: boolean;
  public state = {
    contratosSeleccionados: []
  };
  public montoContratosSeleccionados: string;

  constructor(
    private appState$: Store<store.State>,
    private simuladorApiService: SimuladorApiService,
    public readonly notifierService: NotifierService
  ) {}

  ngOnInit(): void {
    this.typeAlert = NotificationTypeEnum.Danger;
  }

  ngOnChanges() {
    this.totalValorSeleccionados = null;
    this.state.contratosSeleccionados = this.listaContratos;
    this.calcularMontoCertificados();
    const contratosSeleccionados = this.listaContratos.filter(contrato => contrato.seleccionado);
    this.primeraSeleccion = !contratosSeleccionados.length;
  }

  ngOnDestroy(): void {}

  public get desabilitarSimular() {
    const contratosSeleccionados = this.listaContratos.filter(contrato => contrato.seleccionado);
    return contratosSeleccionados.length;
  }

  public seleccionarContrato(
    contrato: IListaContratosSimulador,
    habilitado: boolean,
    index: number
  ) {
    this.listaContratos[index].seleccionado = contrato.seleccionado;
    if (habilitado) {
      this.seleccionandoContrato.emit(true);
      if (this.primeraSeleccion) {
        this.loading = true;
        this.servicioSeleccionarContrato(contrato.contratoId);
      } else {
        this.deseleccionarChecks(index);
        this.calcularMontoCertificados();
      }
    }
  }

  private validarUnSoloIncluido(index: number) {
    const contratoSeleccionadoPosicion = this.listaContratos.findIndex(
      contrato => contrato.seleccionado
    );

    return contratoSeleccionadoPosicion === index ? true : false;
  }

  private deseleccionarChecks(index: number) {
    const contratosIncluidos = this.listaContratos.filter(contrato => contrato.incluido);
    const contratosSeleccionados = this.listaContratos.filter(contrato => contrato.seleccionado);
    const validarUnSoloSeleccionado = this.validarUnSoloIncluido(index);

    if (contratosIncluidos.length === 1) {
      if (
        (validarUnSoloSeleccionado && contratosSeleccionados.length === 1) ||
        contratosSeleccionados.length === 0
      ) {
        this.setearListaContratos();
      }
    } else if (contratosIncluidos.length !== contratosSeleccionados.length) {
      this.setearListaContratos();
    }
  }

  private setearListaContratos() {
    const { payload, servicio } = this.simuladorApiService.listarServiciosPayload;
    this.appState$.dispatch(new listarContratosActions.LoadAction(payload, servicio));
    this.listaContratos.forEach((_contratos, indexContrato) => {
      this.listaContratos[indexContrato].seleccionado = false;
      this.listaContratos[indexContrato].readOnly = false;
    });
    this.primeraSeleccion = true;
    this.totalValorSeleccionados = null;
  }

  public calcularMontoCertificados() {
    this.totalValorSeleccionados = null;
    const contratosSeleccionados = this.listaContratos.filter(contrato => contrato.seleccionado);

    if (contratosSeleccionados.length) {
      this.totalValorSeleccionados = contratosSeleccionados
        .map((contrato: IListaContratosSimulador) => {
          return parseFloat(contrato.valorCertificado);
        })
        .reduce(function(total, num) {
          return total + num;
        });
    }
  }

  private servicioSeleccionarContrato(contratoId: number) {
    this.simuladorApiService.seleccionarContrato(contratoId).subscribe(
      (listaContratos: IListaContratosSimulador[]) => {
        this.primeraSeleccion = false;
        this.listaContratos = listaContratos;
        this.loading = false;
        this.calcularMontoCertificados();
      },
      (error: APIError) => {
        if (error) {
          this.errorContratos = error.mensaje;
          this.loading = false;
        }
      }
    );
  }

  public simularButton() {
    this.simular.emit(this.listaContratos);
  }
}
