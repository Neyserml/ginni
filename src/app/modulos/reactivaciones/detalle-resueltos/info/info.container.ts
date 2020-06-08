import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AsociadoDetalleEnum } from 'app/modulos/reactivaciones/detalle-resueltos/detalle-resueltos.enum';
import {
  CiaTipo,
  InformacionContratoResueltoResponse,
  MovimientosAdministrativosDetalle,
  MovimientosAdministrativosResponse,
  ProximasAsambleasTipo
} from '../detalle-resueltos.interface';
import { DetalleResueltosService } from '../detalle-resueltos.service';
import { abreviar, dateFormat, formatoMoneda } from 'app/@compartidos/utils/helpers';
import { BandejaService } from 'app/modulos/reactivaciones/bandeja/bandeja.service';
import { BandejaEnum } from 'app/modulos/reactivaciones/bandeja/bandeja.enum';
import { collapseInDownAnimation } from 'app/@compartidos/animations/collapseInDown.animation';
import { APIError } from '../../../../@compartidos/models';

@Component({
  selector: 'ginni-info',
  styleUrls: ['./info.container.scss'],
  animations: [collapseInDownAnimation],
  templateUrl: './info.container.html'
})
export class InfoComponent implements OnInit {
  public ciaDetalle: CiaTipo[];
  public contratoActual: InformacionContratoResueltoResponse;
  public fondoDeRemate = 0.0;
  public mostrarFondoDeRemate = false;
  public movimientosAdministrativos: MovimientosAdministrativosResponse;
  public proximasAsambleas: ProximasAsambleasTipo[];
  public failedCiaDetalle;
  public failedContratoActual;
  public failedFondoDeRemate;
  public failedMovimientosAdministrativos;
  public failedProximasAsambleas;
  public loadingCiaDetalle = false;
  public loadingContratoActual = false;
  public loadingFondoDeRemate = false;
  public loadingMovimientosAdministrativos = false;
  public loadingProximasAsambleas = false;

  public state = {
    accordeon: [],
    item: {}
  };

  constructor(
    private asociadoDetalleService: DetalleResueltosService,
    private bandejaService: BandejaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadingCiaDetalle = true;
    this.loadingProximasAsambleas = true;
    this.loadingContratoActual = true;
    this.loadingFondoDeRemate = true;
    this.loadingMovimientosAdministrativos = true;
    if (this.bandejaService.contratoActual) {
      const contratoId = this.bandejaService.contratoActual.reactivacionContratoID;
      this.getInformacionContratoResuelto(contratoId);
      this.getFondoDeRemate(contratoId);
      this.getMovimientosAdministrativos(contratoId);
      this.getCiaDetalle(contratoId);
      this.getProximasAsambleas(contratoId);
    } else {
      this.router.navigate([`${BandejaEnum.Url}`]);
    }
  }

  public _abreviar = abreviar;
  public _dateFormat = dateFormat;
  public _formatoMoneda = formatoMoneda;

  public abrirFondoDeRemate(): void {
    this.mostrarFondoDeRemate = true;
  }

  public cerrarFondoDeRemate(): void {
    this.mostrarFondoDeRemate = false;
  }

  private generateAccordeonState(items: MovimientosAdministrativosDetalle[]) {
    items.forEach((item, index) => {
      this.state.item = item;
      this.state.accordeon[index] = false;
    });
  }

  public tipoInmueble(): boolean {
    return this.contratoActual.tipoBien === AsociadoDetalleEnum.Inmueble;
  }

  public tipoVehiculo(): boolean {
    return this.contratoActual.tipoBien === AsociadoDetalleEnum.Vehiculo;
  }

  public toggleCollapse(index: number): void {
    this.state.accordeon.forEach((item, i) => {
      this.state.item = item;
      this.state.accordeon[i] =
        index === i ? (this.state.accordeon[i] = !this.state.accordeon[i]) : false;
    });
  }

  private getCiaDetalle(contratoId: number) {
    this.asociadoDetalleService.getCiaDetalle(contratoId).subscribe(
      res => {
        this.loadingCiaDetalle = false;
        this.ciaDetalle = res;
      },
      (error: APIError) => {
        this.failedCiaDetalle = error.mensaje;
        this.loadingCiaDetalle = false;
      }
    );
  }

  private getFondoDeRemate(contratoId: number) {
    this.asociadoDetalleService.getFondoDeRemate(contratoId).subscribe(
      res => {
        this.loadingFondoDeRemate = false;
        this.fondoDeRemate = Number(res.fondoRemate);
      },
      (error: APIError) => {
        this.failedFondoDeRemate = error.mensaje;
        this.loadingFondoDeRemate = false;
      }
    );
  }

  private getInformacionContratoResuelto(contratoId: number) {
    this.asociadoDetalleService.getInformacionContratoResuelto(contratoId).subscribe(
      contrato => {
        this.loadingContratoActual = false;
        this.contratoActual = contrato;
      },
      (error: APIError) => {
        this.failedContratoActual = error.mensaje;
        this.loadingContratoActual = false;
      }
    );
  }

  private getMovimientosAdministrativos(contratoId: number) {
    this.asociadoDetalleService.getMovimientosAdministrativos(contratoId).subscribe(
      res => {
        this.loadingMovimientosAdministrativos = false;
        this.movimientosAdministrativos = res;
        this.generateAccordeonState(this.movimientosAdministrativos.movimientosAdministrativos);
      },
      (error: APIError) => {
        this.failedMovimientosAdministrativos = error.mensaje;
        this.loadingMovimientosAdministrativos = false;
      }
    );
  }

  public getProximasAsambleas(contratoId: number) {
    this.asociadoDetalleService.getProximasAsambleas(contratoId).subscribe(
      res => {
        this.loadingProximasAsambleas = false;
        this.proximasAsambleas = res;
      },
      (error: APIError) => {
        this.failedProximasAsambleas = error.mensaje;
        this.loadingProximasAsambleas = false;
      }
    );
  }
}
