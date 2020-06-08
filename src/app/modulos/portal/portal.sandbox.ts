import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, PRIMARY_OUTLET, ActivatedRoute } from '@angular/router';

import { IBreadcrumb } from './@interface/breadcrumb.interface';
import { Localidades } from './@models/localidades.model';
import { Usuario } from './usuario';
import { IProp } from 'app/@compartidos/models';
import {
  unirListMenuServicio,
  createTitle,
  getMenuItemByClave,
  esMobile,
  onResizeWindow
} from 'app/@compartidos/utils/helpers';
import { IMenuItem, IPaginaItem, PAGINAS } from 'app/@compartidos/utils/perfiles-items';
import { Perfiles, DocumentosBotones } from './portal.enum';

@Injectable()
export class PortalSandbox {
  public menu: IMenuItem[] = [];
  public breadcrumbs: IBreadcrumb[] = [];
  public paginas: IPaginaItem[] = PAGINAS;
  public usuario = new Usuario();
  public esMobile = esMobile();
  public paises: IProp[] = [];
  public departamentos: IProp[] = [];
  public ID_PERU;

  constructor(
    private title: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    onResizeWindow(this.resizeWindow);
  }

  get esDesktop() {
    return !this.esMobile;
  }

  private resizeWindow = (): void => {
    if (esMobile() !== this.esMobile) {
      this.esMobile = esMobile();
    }
  };

  public handleLocalidades(localidades: Localidades): void {
    this.paises = localidades.paises;
    this.ID_PERU = this.paises.filter((pais: IProp) => pais.valor === 'PERÚ')[0].clave;
    this.departamentos = localidades.departamentos;
  }

  public getUrlWithoutParams(url: string = this.router.url): string {
    const urlTree = this.router.parseUrl(url);
    return urlTree.root.children['primary'].segments.map(it => it.path).join('/');
  }

  public actualizarPerfil(perfiles): void {
    this.menu = unirListMenuServicio(perfiles.menu);
    this.actualizarPaginas(perfiles.paginas);
  }

  public actualizarPaginas(paginas: IPaginaItem[]) {
    this.paginas = this.paginas.map(pagina => {
      const menuItem = getMenuItemByClave(pagina.clave, this.menu);
      const paginaItem = getMenuItemByClave(pagina.clave, paginas);
      return {
        ...pagina,
        ...menuItem,
        ...paginaItem
      };
    });
  }

  public setTitle(): void {
    const findedPagina = this.getPagina();
    if (findedPagina) {
      this.title.setTitle(createTitle(findedPagina.nombre));
    } else {
      this.title.setTitle(createTitle());
    }
  }

  public getPagina(clave?: string): IPaginaItem {
    const paginasFiltradas = this.paginas.filter(item =>
      clave ? item.clave === clave : item.regex.exec(this.router.url)
    );
    return paginasFiltradas[0];
  }

  public getRestriccion() {
    let restriccion;
    switch (this.usuario.perfil) {
      case Perfiles.FuncionarioServicioVentas:
      case Perfiles.FuncionarioCredito:
      case Perfiles.FuncionarioAutomotriz:
      case Perfiles.JefeNegocios:
        restriccion = {
          accesoEditar: true,
          botonesDocumentos: [
            { texto: DocumentosBotones.EnvioComite, color: 'ui-button-primary' },
            { texto: DocumentosBotones.Anular, color: 'ui-button-dark' }
          ]
        };
        break;
      case Perfiles.AsistenteLegal:
        restriccion = {
          accesoEditar: false,
          botonesDocumentos: [
            { texto: DocumentosBotones.Aprobado, color: 'ui-button-primary' },
            { texto: DocumentosBotones.Observado, color: 'ui-button-dark' }
          ]
        };
        break;
      case Perfiles.AsistenteRecupero:
        restriccion = {
          accesoEditar: false,
          botonesDocumentos: [
            { texto: DocumentosBotones.Siguiente, color: 'ui-button-blue-strong' },
            { texto: DocumentosBotones.Aprobado, color: 'ui-button-primary' },
            { texto: DocumentosBotones.Observado, color: 'ui-button-dark' }
          ]
        };
        break;
      case Perfiles.JefeRecupero:
        restriccion = {
          accesoEditar: false,
          botonesDocumentos: [
            { texto: DocumentosBotones.Siguiente, color: 'ui-button-blue-strong' },
            { texto: DocumentosBotones.Aprobado, color: 'ui-button-primary' },
            { texto: DocumentosBotones.Observado, color: 'ui-button-dark' }
          ]
        };
        break;
      case Perfiles.GerenciaOperaciones:
        restriccion = {
          accesoEditar: false,
          botonesDocumentos: [
            { texto: DocumentosBotones.Aprobado, color: 'ui-button-primary' },
            { texto: DocumentosBotones.Observado, color: 'ui-button-dark' }
          ]
        };
        break;
      default:
        restriccion = {
          accesoEditar: false,
          botonesDocumentos: []
        };
        break;
    }
    return restriccion;
  }

  public updateBreadcrumbs(): void {
    const root: ActivatedRoute = this.activatedRoute.root;
    this.breadcrumbs = this.getBreadcrumbs(root, '/portal');
  }

  private getBreadLabel(bread): string {
    const paginaItem = getMenuItemByClave(bread.key, this.paginas);
    if (paginaItem && paginaItem.nombre) {
      return paginaItem.nombre.toString();
    } else {
      return bread.key.toString();
    }
  }

  private getBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: IBreadcrumb[] = []
  ): IBreadcrumb[] {
    const ROUTE_DATA_BREADCRUMB = 'breadcrumb';

    // get the child routes
    const children: ActivatedRoute[] = route.children;

    // return if there are no more children
    if (children.length === 0) {
      return breadcrumbs;
    }

    // iterate over each children
    for (const child of children) {
      // verify primary route
      if (child.outlet !== PRIMARY_OUTLET) {
        continue;
      }

      // verify the custom data property "breadcrumb" is specified on the route
      if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
        return this.getBreadcrumbs(child, url, breadcrumbs);
      }

      // get the route's URL segment
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');

      if (routeURL !== '') {
        // append route URL to URL
        url += `/${routeURL}`;
      }

      // add breadcrumb
      const breadcrumb: IBreadcrumb = {
        key: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
        params: child.snapshot.params,
        url: url
      };

      if (breadcrumbs.map(bread => bread.key).indexOf(breadcrumb.key) === -1) {
        breadcrumb.label = this.getBreadLabel(breadcrumb);
        breadcrumbs.push(breadcrumb);
      }

      // recursive
      return this.getBreadcrumbs(child, url, breadcrumbs);
    }
  }
}
