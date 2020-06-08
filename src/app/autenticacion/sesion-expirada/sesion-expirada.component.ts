import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import './vendor/lamp';
import { init } from './vendor/lamp.init';
import { createTitle } from 'app/@compartidos/utils/helpers';

@Component({
  selector: 'ginni-sesion-expirada',
  template: `
    <div class="expiracion" ginniAllPageHeight [addPageHeight]="50">
      <div class="expiracion-container">
        <div id="animation_container" style="margin: 0 auto;">
          <canvas id="canvas" width="250" height="250" style="display: block; "></canvas>
        </div>
        <div class="expiracion-title">Notificación de cierre de sesión</div>
        <div class="expiracion-body">Por tu seguridad vuelve a ingresar.</div>
        <a routerLink="/inicio-sesion" ginniButton color="primary">Iniciar sesión nuevamente</a>
      </div>
    </div>
  `,
  styleUrls: ['./sesion-expirada.component.scss']
})
export class SesionExpiradaComponent implements OnInit {
  _init = init;

  constructor(private titleService: Title) {
    this.titleService.setTitle(createTitle('Sesión expirada'));
  }

  ngOnInit() {
    this._init();
  }
}
