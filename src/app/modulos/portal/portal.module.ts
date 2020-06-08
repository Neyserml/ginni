import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { metaReducers } from 'app/@compartidos/store/meta-reducer';
import { HeaderComponent } from './@components/header/header.component';
import { ModalExpiracionComponent } from './@components/modal-expiracion/modal-expiracion.component';
import { SidebarComponent } from './@components/sidebar/sidebar.component';
import { SidebarItemComponent } from './@components/sidebar/sidebar-item.component';
import { PerfilesResolve } from './@guards/perfiles.resolve';
import { reducers } from './@store';
import { PortalEffect } from './@store/portal.effect';
import { PortalApiService } from './portal.api.service';
import { PortalContainer } from './portal.container';
import { PortalGuard } from './portal.guard';
import { PortalRoutingModule } from './portal.routing';
import { PortalSandbox } from './portal.sandbox';
import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';

@NgModule({
  imports: [
    CommonModule,
    PortalRoutingModule,
    CompartidosModule.forRoot(),
    StoreModule.forFeature('portal', reducers, { metaReducers }),
    EffectsModule.forFeature([PortalEffect])
  ],
  declarations: [
    PortalContainer,
    HeaderComponent,
    SidebarComponent,
    SidebarItemComponent,
    ModalExpiracionComponent
  ],
  providers: [
    PortalApiService,
    PortalSandbox,
    PortalGuard,
    providersHttpInterceptors,
    PerfilesResolve
  ]
})
export class PortalModule {}
