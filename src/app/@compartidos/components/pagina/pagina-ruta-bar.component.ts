import { Component, Input, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import { BANDEJA_TRABAJO } from 'app/modulos/portal/portal.enum';

interface IBreadcrumb {
  key: string;
  label?: string;
  params: Params;
  url: string;
}

@Component({
  selector: 'ginni-pagina-ruta-bar',
  template: `
    <ng-container *ngFor="let list of listUrls; let i = index">
      <span *ngIf="i !== 0">></span>
      <a class="cursor-pointer" *ngIf="listUrls.length !== i + 1" (click)="clickRuta(list)">
        {{ list }}
      </a>
      <span *ngIf="listUrls.length === i + 1">{{ list }}</span>
    </ng-container>
  `,
  styleUrls: ['./pagina-ruta-bar.component.scss']
})
export class PaginaRutaBarComponent implements OnInit {
  public listUrls: string[] = [];

  @Input()
  public breadcrumbs: IBreadcrumb[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    // para evaluacion crediticia, reactivaciones no tiene
    if (this.router.url.endsWith('evaluacion/crediticia')) {
      this.listUrls = ['Mi bandeja de trabajo', 'Detalle'];
    } else if (this.router.url.includes('en-tramite') || this.router.url.includes('aprobados')) {
      this.listUrls = ['Mi bandeja de trabajo', 'Detalle'];
    } else if (this.router.url.includes('editar')) {
      this.listUrls = ['Mi bandeja de trabajo', 'Detalle', 'Editar'];
    } else if (this.router.url.includes('ver')) {
      this.listUrls = ['Mi bandeja de trabajo', 'Detalle', 'Ver'];
    } else {
      this.listUrls = [];
    }
  }

  public clickRuta(listName: string) {
    if (listName === BANDEJA_TRABAJO) {
      this.router.navigateByUrl('/portal');
    } else {
      const url = this.breadcrumbs.filter(item => item.label === listName)[0].url;
      this.router.navigateByUrl(url);
    }
  }
}
