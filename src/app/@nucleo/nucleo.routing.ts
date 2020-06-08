import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';

/**
 * Redirecciona por default al abrirse otras pestañas
 */
export const NUCLEO_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/portal',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/portal'
  }
];

const config: ExtraOptions = {
  useHash: true
};

@NgModule({
  imports: [RouterModule.forRoot(NUCLEO_ROUTES, config)],
  exports: [RouterModule]
})
export class NucleoRoutingModule {}
