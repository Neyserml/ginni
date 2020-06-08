export enum Conceptos {
  NUMERO_CONTRATO = 'N° DE CONTRATO',
  DATOS = 'DATOS',
  DOCUMENTO_IDENTIDAD = 'DOCUMENTO DE IDENTIDAD'
}
export enum Mensajes {
  MENSAJE_CONTRATO = 'El número de contrato debe incluir solo números'
}

export enum ServiciosListar {
  POR_CONTRATO = 'listarPorContrato',
  POR_PERSONA = 'listarPorPersona'
}

export enum TipoDocumento {
  DNI = 'DNI',
  CE = 'C.E.',
  RUC = 'RUC'
}

export enum ServicioListarPor {
  PERSONA = 'PERSONA',
  CONTRATO = 'CONTRATO',
  DOCUMENTO = 'DOCUMENTO'
}

export const LISTA_COLUMNAS_CONTRATOS = [
  {
    name: 'N° contrato',
    className: 'th-width-10'
  },
  {
    name: 'Nombre completo',
    className: ''
  },
  {
    name: 'Situación',
    className: 'only-desktop'
  },
  {
    name: 'Valor del certificado',
    className: 'text-center only-desktop'
  },
  {
    name: 'N° cuotas pagadas',
    className: 'text-center only-desktop'
  },
  {
    name: 'Célula',
    className: 'only-desktop'
  },
  {
    name: `<div>Evaluación</div><div> crediticia</div>`,
    className: 'text-center only-desktop'
  },
  {
    name: 'Pedido',
    className: 'text-center only-desktop'
  },
  {
    name: 'Selección',
    className: 'th only-desktop'
  }
];
