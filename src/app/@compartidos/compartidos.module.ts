import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TextMaskModule } from 'angular2-text-mask';
import { Ng5SliderModule } from 'ng5-slider';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { NgxPaginationModule } from 'ngx-pagination';
import { TooltipModule, TooltipOptions } from 'ng2-tooltip-directive';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CargandoComponent } from './components/cargando/cargando.component';
import { ErrorServicioComponent } from './components/error-servicio/error-servicio.component';
import { ButtonDirective } from './directives/button/button.directive';
import { ModalComponent } from './components/modal/modal.component';
import { ModalHeadComponent } from './components/modal/modal-head.component';
import { PaginaComponent } from './components/pagina/pagina.component';
import { SoloRegexDirective } from './directives/solo-regex/solo-regex.directive';
import { ExpandDirective } from './directives/expand/expand.directive';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HttpClientModule } from '@angular/common/http';
import { SvgComponent } from './components/svg/svg.component';
import { EnConstruccionComponent } from './components/en-construccion/en-construccion.component';
import { ValidationService } from './utils/validation.service';
import { AllPageHeightDirective } from './directives/all-page-height/all-page-height.directive';
import { PaginaContainerComponent } from './components/pagina/pagina-container.component';
import { PaginadorComponent } from './components/paginador/paginador.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { TabComponent } from './components/tabs/tab.component';
import { TabControlComponent } from './components/tabs/tab-control.component';
import { FooterComponent } from './components/footer/footer.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { CheckboxGroupComponent } from './components/checkbox/checkbox-group.component';
import { MultiRadioButtonComponent } from './components/radio-button/multi-radio-button.component';
import { CapitalizeTextPipe } from './pipe/capitalize-text.pipe';
import { OrderByAsc } from './pipe/orderByAsc.pipe';
import { SanitizeUrlPipe } from './pipe/sanitize-url.pipe';
import { PaginaFullComponent } from './components/pagina/pagina-full.component';
import { RefreshApiService } from './services/refresh-api.service';
import { ErrorHandlerService } from './services/error-handler.service';
import { GlobalErrorHandlerService } from './services/global-error-handler.service';
import { LoggingErrorHandlerService } from './services/logging-error-handler.service';
import { NotificationErrorHandlerService } from './services/notification-error-handler.service';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { PaginaRutaBarComponent } from './components/pagina/pagina-ruta-bar.component';
import { CircleProgressComponent } from './components/circle-progress/circle-progress.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { ButtonIconComponent } from './components/button-icon/button-icon.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { DropdownOptionComponent } from './components/dropdown/dropdown-option.component';
import { SelectComponent } from './components/select/select.component';
import { ModalContainerComponent } from './components/modal/modal-container.component';
import { TabTitleComponent } from './components/tabs/tab-title.component';
import { VerMasComponent } from './components/ver-mas/ver-mas.component';
import { SwitchComponent } from './components/switch/switch.component';
import { BorrarFilaComponent } from './components/borrar-fila/borrar-fila.component';
import { HeaderDetalleComponent } from './components/header/header-detalle.component';
import { RadioButtonComponent } from './components/radio-button/radio-button.component';
import { RadioGroupComponent } from './components/radio-button/radio-group.component';
import { InputDateComponent } from './components/input-date/input-date.component';
import { NoPermitirCaracteresDirective } from './directives/no-permitir-caracteres/no-permitir-caracteres.directive';
import { SoloNumerosDirective } from './directives/solo-numeros/solo-numeros.directive';
import { SoloLetrasDirective } from './directives/solo-letras/solo-letras.directive';
import { PrimerDigitoDiferenteDeCeroDirective } from './directives/primer-digito-diferente-de-cero/primer-digito-diferente-de-cero.directive';
import { MaximosDecimalesDirective } from './directives/maximos-decimales/maximos-decimales.directive';
import { MontoMaximoDirective } from './directives/monto-maximo/monto-maximo.directive';
import { MaximosEnterosDirective } from './directives/maximos-enteros/maximos-enteros.directive';
import { ScrollToFirstInvalidDirective } from './directives/scroll-to-first-invalid/scroll-to-first-invalid.directive';
import { CheckComponent } from './components/check/check.component';
import { DoubleSliderComponent } from './components/double-slider/double-slider.component';
import { ModalCloseDirective } from './directives/modal-close/modal-close.directive';
import { NumerosEnterosDirective } from 'app/@compartidos/directives/numeros-enteros/numeros-enteros.directive';
import { TabBarComponent } from './components/tab-bar/tab-bar.component';
import { TabbarItemComponent } from './components/tab-bar/tab-bar-item.component';
import { DropdownTableComponent } from './components/dropdown-table/dropdown-table.component';
import { CiaDetalleComponent } from './components/cia-detalle/cia-detalle.component';
import { AdjudicadosDetalleComponent } from './components/adjudicados-detalle/adjudicados-detalle.component';
import { ProximasAsambleasComponent } from './components/proximas-asambleas/proximas-asambleas.component';
import { ValidarMaxMinDirective } from './directives/validar-max-min/validar-max-min.directive';
import { SimuladorFinanciamientoComponent } from './components/simulador-financiamiento/simulador-financiamiento.component';
import { AlertComponent } from './components/alert/alert.component';
import { BuscadorComponent } from './components/buscador/buscador.component';
import { TabPageComponent } from './components/tab-page/tab-page.component';
import { TabPageItemComponent } from './components/tab-page/tab-page-item.component';
import { GrillasComponent } from './components/grillas/grillas.component';
import { IterateObjectPipe } from './pipe/iterate-object.pipe';
import { LeyendaComponent } from './components/leyenda/leyenda.component';
import { CheckStatusReactivacionesComponent } from './components/check-status-reactivaciones/check-status-reactivaciones.component';
import { SoloNumerosYGuionYGuionDirective } from './directives/solo-numeros-y-guion/solo-numeros-y-guion.directive';
import { ModalIconSubtextComponent } from './components/modal/modal-icon-subtext.component';
import { ModalConfirmComponent } from './components/modal/modal-confirm.component';
import { FormComponent } from './components/form/form.component';

export const MyDefaultTooltipOptions: TooltipOptions = {
  placement: 'bottom'
};

@NgModule({
  imports: [
    TooltipModule.forRoot(MyDefaultTooltipOptions as TooltipOptions),
    TextMaskModule,
    AngularSvgIconModule,
    HttpClientModule,
    CommonModule,
    RouterModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    NgxSmartModalModule.forRoot(),
    Ng5SliderModule
  ],
  declarations: [
    AllPageHeightDirective,
    AdjudicadosDetalleComponent,
    AlertComponent,
    BorrarFilaComponent,
    ButtonIconComponent,
    ButtonDirective,
    BuscadorComponent,
    CargandoComponent,
    CapitalizeTextPipe,
    CircleProgressComponent,
    CheckboxComponent,
    CheckboxGroupComponent,
    CheckComponent,
    CheckStatusReactivacionesComponent,
    CiaDetalleComponent,
    DialogComponent,
    DoubleSliderComponent,
    DropdownComponent,
    DropdownOptionComponent,
    DropdownTableComponent,
    ExpandDirective,
    EnConstruccionComponent,
    ErrorServicioComponent,
    FooterComponent,
    FormComponent,
    GrillasComponent,
    HeaderDetalleComponent,
    InputDateComponent,
    IterateObjectPipe,
    NumerosEnterosDirective,
    NoPermitirCaracteresDirective,
    MaximosDecimalesDirective,
    MaximosEnterosDirective,
    ModalContainerComponent,
    MontoMaximoDirective,
    ModalCloseDirective,
    ModalComponent,
    ModalConfirmComponent,
    ModalIconSubtextComponent,
    ModalHeadComponent,
    MultiRadioButtonComponent,
    LeyendaComponent,
    OrderByAsc,
    PaginaFullComponent,
    PaginaRutaBarComponent,
    PaginaComponent,
    PaginaContainerComponent,
    PaginadorComponent,
    PrimerDigitoDiferenteDeCeroDirective,
    ProximasAsambleasComponent,
    RadioButtonComponent,
    RadioGroupComponent,
    SanitizeUrlPipe,
    SimuladorFinanciamientoComponent,
    SvgComponent,
    SelectComponent,
    SwitchComponent,
    SoloNumerosDirective,
    SoloNumerosYGuionYGuionDirective,
    SoloLetrasDirective,
    ScrollToFirstInvalidDirective,
    SoloRegexDirective,
    TabsComponent,
    TabComponent,
    TabControlComponent,
    TabTitleComponent,
    TabBarComponent,
    TabbarItemComponent,
    TabPageComponent,
    TabPageItemComponent,
    ValidarMaxMinDirective,
    VerMasComponent
  ],
  exports: [
    AllPageHeightDirective,
    AdjudicadosDetalleComponent,
    AlertComponent,
    BorrarFilaComponent,
    ButtonIconComponent,
    ButtonDirective,
    BuscadorComponent,
    CargandoComponent,
    CapitalizeTextPipe,
    CircleProgressComponent,
    CheckboxComponent,
    CheckboxGroupComponent,
    CheckComponent,
    CheckStatusReactivacionesComponent,
    CiaDetalleComponent,
    DialogComponent,
    DoubleSliderComponent,
    DropdownComponent,
    DropdownOptionComponent,
    DropdownTableComponent,
    ExpandDirective,
    EnConstruccionComponent,
    ErrorServicioComponent,
    FooterComponent,
    FormComponent,
    GrillasComponent,
    HeaderDetalleComponent,
    InputDateComponent,
    IterateObjectPipe,
    NumerosEnterosDirective,
    NoPermitirCaracteresDirective,
    MaximosDecimalesDirective,
    MaximosEnterosDirective,
    ModalContainerComponent,
    MontoMaximoDirective,
    ModalCloseDirective,
    ModalComponent,
    ModalConfirmComponent,
    ModalIconSubtextComponent,
    ModalHeadComponent,
    MultiRadioButtonComponent,
    LeyendaComponent,
    OrderByAsc,
    PaginaFullComponent,
    PaginaRutaBarComponent,
    PaginaComponent,
    PaginaContainerComponent,
    PaginadorComponent,
    PrimerDigitoDiferenteDeCeroDirective,
    ProximasAsambleasComponent,
    RadioButtonComponent,
    RadioGroupComponent,
    SanitizeUrlPipe,
    SimuladorFinanciamientoComponent,
    SvgComponent,
    SelectComponent,
    SwitchComponent,
    SoloNumerosDirective,
    SoloNumerosYGuionYGuionDirective,
    SoloLetrasDirective,
    ScrollToFirstInvalidDirective,
    SoloRegexDirective,
    TabsComponent,
    TabComponent,
    TabControlComponent,
    TabTitleComponent,
    TabBarComponent,
    TabbarItemComponent,
    TabPageComponent,
    TabPageItemComponent,
    ValidarMaxMinDirective,
    VerMasComponent
  ]
})
export class CompartidosModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CompartidosModule,
      providers: [
        ErrorHandlerService,
        GlobalErrorHandlerService,
        LoggingErrorHandlerService,
        NotificationErrorHandlerService,
        RefreshApiService,
        TokenInterceptorService,
        ValidationService
      ]
    };
  }
}
