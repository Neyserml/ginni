import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioSesionContainer } from './inicio-sesion/inicio-sesion.container';

export const PAGINAS_ROUTES: Routes = [
  { path: 'inicio-sesion', component: InicioSesionContainer },
  { path: 'portal', loadChildren: '../modulos/portal/portal.module#PortalModule' },
  {
    path: 'recuperar-contrasenia',
    loadChildren: './recuperar-contrasenia/recuperar-contrasenia.module#RecuperarContraseniaModule'
  },
  {
    path: 'sesion-expirada',
    loadChildren: './sesion-expirada/sesion-expirada.module#SesionExpiradaModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(PAGINAS_ROUTES)],
  exports: [RouterModule]
})
export class AutenticacionRoutingModule {}
