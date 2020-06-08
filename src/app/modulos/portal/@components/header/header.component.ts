import {
  Component,
  ViewEncapsulation,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import * as moment from 'moment';

import { DIAS, MESES } from './consts';
import { Usuario } from 'app/modulos/portal/usuario';

@Component({
  selector: 'ginni-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit, OnDestroy, OnChanges {
  @Input() usuario: Usuario = new Usuario();
  @Input() activeMenu: boolean;

  @Output() activeMenuChange = new EventEmitter();
  @Output() cerrarSesion = new EventEmitter();

  public activeUserMenu = false;
  public fechaActual: string;
  public notificaciones = 0;
  public usuarioNombre: string;
  public usuarioApellido: string;

  ngOnInit() {
    const dayNumber = moment()
      .startOf('day')
      .format('DD');
    const day = moment().day();
    const month = moment()
      .startOf('month')
      .format('MM');
    const year = moment().year();

    const diaDeLaSemana = this.getFecha(DIAS, day);
    const mesDelAnio = this.getFecha(MESES, month);
    this.fechaActual = diaDeLaSemana + ' ' + dayNumber + ' de ' + mesDelAnio + ' de ' + year;
  }

  ngOnChanges() {
    this.usuarioNombre = this.capitalizar(this.usuario.primerNombre);
    this.usuarioApellido = this.capitalizar(this.usuario.apellidoPaterno);
  }

  private capitalizar(texto: string) {
    const nombres = texto.split(' ');
    const nombresArray = nombres.map(nombre => {
      if (nombre) {
        const textoMinuscula = nombre.toLowerCase();
        const primeraLetra = textoMinuscula[0];
        return textoMinuscula.replace(primeraLetra, primeraLetra.toUpperCase());
      }
    });
    const nombresString = nombresArray.toString();
    const nombresCapitalize = nombresString.replace(',', ' ');
    return nombresCapitalize;
  }

  public onBlur = event => {
    if (event.target.closest('.header')) {
      return;
    } else {
      this.activeUserMenu = false;
    }
  };

  public getFecha(arrayFecha, fechaNumero) {
    for (let index = 0; index < arrayFecha.length; index++) {
      if (index === parseInt(fechaNumero, 10) - 1) {
        return arrayFecha[index];
      }
    }
  }

  public clickUserMenu() {
    this.activeUserMenu = !this.activeUserMenu;
  }

  public ngOnDestroy() {
    document.body.removeEventListener('click', this.onBlur);
  }
}
