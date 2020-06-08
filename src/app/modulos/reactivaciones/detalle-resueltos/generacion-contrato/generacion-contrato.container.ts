import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  OnChanges
} from '@angular/core';
import { collapseInDownAnimation } from 'app/@compartidos/animations/collapseInDown.animation';
import { HASH } from 'app/@compartidos/utils/consts';
import { Rutas } from './generar-contratos.enum';

@Component({
  selector: 'ginni-generacion-contrato',
  animations: [collapseInDownAnimation],
  styleUrls: ['./generacion-contrato.container.scss'],
  templateUrl: './generacion-contrato.container.html',
  encapsulation: ViewEncapsulation.None
})
export class GeneracionContratoContainer implements OnInit, OnChanges {
  @ViewChild('bar2')
  public bar2: ElementRef;

  @ViewChild('esfera1')
  public esfera1: ElementRef;

  @ViewChild('texto1')
  public texto1: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {}

  onActivate() {}

  onDeactivate(): void {
    const rutaActual = this.pestania();
    this.activatedSphere(rutaActual);
  }

  private activatedSphere(route: string): void {
    switch (route) {
      case Rutas.ValidarDatos:
        this.bar2.nativeElement.className = 'bar active';
        this.esfera1.nativeElement.className = 'esfera--fondo active';
        this.texto1.nativeElement.className = 'esfera--texto activated';
        break;
      default:
        break;
    }
  }

  private pestania(): string {
    const rutaInicioPosicion = window.location.href.indexOf(HASH);
    const ruta = window.location.href.slice(rutaInicioPosicion);
    const lastIndexSlash = ruta.lastIndexOf('/');
    const rutaCantidadLetras = ruta.length - (lastIndexSlash + 1);
    const slice = ruta.slice(-rutaCantidadLetras);
    return slice;
  }

  public sphereSelected(item: number) {
    switch (item) {
      case 1:
        this.bar2.nativeElement.className = 'bar';
        this.esfera1.nativeElement.className = 'esfera--fondo';
        break;
      case 2:
        this.bar2.nativeElement.className = 'bar active';
        this.esfera1.nativeElement.className = 'esfera--fondo active';
        this.texto1.nativeElement.className = 'esfera--texto activated';
        break;
      default:
        this.bar2.nativeElement.className = 'bar';
        this.esfera1.nativeElement.className = 'esfera--fondo';
        this.texto1.nativeElement.className = 'esfera--texto';
        break;
    }
  }
}
