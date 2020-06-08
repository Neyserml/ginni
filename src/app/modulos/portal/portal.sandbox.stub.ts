export const PortalSandboxStub = {
  resizeWindow: () => {},
  handleLocalidades: () => {},
  getUrlWithoutParams: () => '123456',
  actualizarPerfil: () => {},
  actualizarPaginas: () => {},
  setTitle: () => {},
  getPagina: () => ({
    regex: '[a-zA-Z0-9-]'
  }),
  updateBreadcrumbs: () => {},
  getBreadLabel: () => {},
  getBreadcrumbs: () => [
    {
      key: 'key',
      params: {
        hey: 'you'
      },
      url: 'url'
    }
  ],
  usuario: {
    primerNombre: 'John'
  },
  esMobile: () => true
};
