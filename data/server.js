
const express = require('express');
const chalk = require('chalk');
const APIError = require('./APIError');
const internalIp = require('internal-ip');
const bodyParser = require('body-parser');
const httpStatus = require('http-status');
const cors = require('cors');
const pathToRegexp = require('path-to-regexp');
const routesAsync = require('./routesAsync');
const printStatus = require('./printStatus');
const routes = require('./routes');
const db = {};

db['usuario_1'] = require('./mockup/administracion/usuario_1');
db['usuario_2'] = require('./mockup/administracion/usuario_2');
db['informacionpersonal'] = require('./mockup/administracion/persona/informacionpersonal');
db['informacionpersonaljuridico'] = require('./mockup/administracion/persona/informacionpersonaljuridico');
db['informacionlaboral'] = require('./mockup/administracion/persona/informacionlaboral');
db['lista'] = require('./mockup/administracion/configuraciongeneral/lista');
db['login'] = require('./mockup/login');
db['perfiles'] = require('./mockup/perfiles');
db['recuperar-contrasenia'] = require('./mockup/recuperar-contrasenia');
db['asociado'] = require('./mockup/fondoColectivo/asociado');
db['bandejaGeneral'] = require('./mockup/logistica/evaluacionCrediticia/bandeja');
db['bandejaFuncionario'] = require('./mockup/fondoColectivo/contrato');
db['reactivacioncontrato'] = require('./mockup/fondoColectivo/reactivaciones');
db['reactivacionSummary'] = require('./mockup/fondoColectivo/reactivacionSummary');
db['obtenerDepartamentos'] = require('./mockup/administracion/configuraciongeneral/obtenerDepartamentos');
db['obtenerDistritos'] = require('./mockup/administracion/configuraciongeneral/obtenerDistritos');
db['obtenerPaises'] = require('./mockup/administracion/configuraciongeneral/obtenerPaises');
db['obtenerProvincias'] = require('./mockup/administracion/configuraciongeneral/obtenerProvincias');
db['bloquecontrato'] = require('./mockup/logistica/evaluacionCrediticia/bloqueContrato_1');
db['validarInicio']=require('./mockup/logistica/evaluacionCrediticia/validarInicio');
db['iniciar']=require('./mockup/logistica/evaluacionCrediticia/iniciar');
db['asociadosCabecera'] = require('./mockup/administracion/persona/asociadosCabecera');
db['getAsociadosCabecera'] = require('./mockup/fondoColectivo/reactivacioncontrato/asociados');
db['informacionContrato'] = require('./mockup/administracion/persona/informacionContrato');
db['salir'] = require('./mockup/administracion/salir');
db['refresh-token'] = require('./mockup/administracion/refresh-token');
db['personasRelacionadas']=require('./mockup/administracion/persona/personasRelacionadas/personasRelacionadas');
db['obtenerPersonasRelacionadas']=require('./mockup/administracion/persona/personasRelacionadas/obtenerPersonaRelacionada');
db['ocupacion']=require('./mockup/administracion/configuraciongeneral/ocupacion');
db['ingresos']=require('./mockup/administracion/persona/ingresos');
db['informacionasociado']=require('./mockup/administracion/persona/informacionAsociado');
db['contratos']=require('./mockup/logistica/evaluacionCrediticia/lista-contratos/contratos');
db['agregarContratosModal']=require('./mockup/logistica/evaluacionCrediticia/lista-contratos/modal-agregar-contratos');
db['mostrarMensajeContratos']=require('./mockup/logistica/evaluacionCrediticia/lista-contratos/modal-contratos-mensaje');
db['listarContratosModal']=require('./mockup/logistica/evaluacionCrediticia/lista-contratos/modal-listar-contratos');
db['personas']=require('./mockup/logistica/evaluacionCrediticia/lista-documentos/personas');
db['simularFinanciamientoEvCre']=require('./mockup/logistica/simulador-financiamiento/simular-financiamiento');
db['guardarFinanciamiento']=require('./mockup/logistica/simulador-financiamiento/financiamiento-get');
db['financiamiento']=require('./mockup/logistica/simulador-financiamiento/financiamiento');
db['enviarNotificaciones']=require('./mockup/logistica/evaluacionCrediticia/notificaciones');
db['buscarRespaldo']=require('./mockup/logistica/evaluacionCrediticia/garante/buscarRespaldo');
db['modalDocumentos']=require('./mockup/logistica/evaluacionCrediticia/lista-documentos/listar-documentos');
db['conceptosSimuladorFinanciamiento'] = require('./mockup/logistica/simulador-financiamiento/conceptos');
db['iniciarSimulador'] = require('./mockup/logistica/simulador-financiamiento/iniciar-simulador');
db['calcularDiferencia'] = require('./mockup/logistica/simulador-financiamiento/calcular-diferencia');
db['mensajesSistema'] = require('./mockup/logistica/evaluacionCrediticia/mensajesSistema');
db['listasGenerales'] = require('./mockup/logistica/evaluacionCrediticia/listasGenerales');
db[
  'listadoVerificaciones'
] = require('./mockup/logistica/evaluacionCrediticia/lista-verificaciones/listadoVerificacionesResponse');
db['cargaListaContratosInfoSimulacion']=require('./mockup/fondoColectivo/reactivacionpago/cargaListaContratosInfoSimulacion');
db['cargarListasSimulacion']=require('./mockup/fondoColectivo/reactivacionpago/cargarListasSimulacion');
db['cargarSimulacion']=require('./mockup/fondoColectivo/reactivacionpago/cargarSimulacion');
db['certificados']=require('./mockup/fondoColectivo/reactivacionpago/certificados');
db['ciaDetalle'] = require('./mockup/fondoColectivo/reactivacionpago/ciaDetalle');
db['contratoResueltoInfoSimulacion'] = require('./mockup/fondoColectivo/reactivacionpago/contratoResueltoInfoSimulacion');
db['contratoResueltoRelacionadosSimulacion'] = require('./mockup/fondoColectivo/reactivacionpago/contratoResueltoRelacionadosSimulacion');
db['generar'] = require('./mockup/fondoColectivo/reactivacionpago/contrato/generar');
db['generarRequest'] = require('./mockup/fondoColectivo/reactivacionpago/contrato/generarRequest');
db['asambleasAdjudicadas']=require('./mockup/fondoColectivo/reactivacionpago/detalleContrato/asambleasAdjudicadas');
db['bloqueosEnBandeja'] = require('./mockup/fondoColectivo/reactivacionpago/detalleContrato/bloqueosEnBandeja');
db['eliminarPago'] = require('./mockup/fondoColectivo/reactivacionpago/eliminarPago');
db['fondoRemate'] = require('./mockup/fondoColectivo/reactivacionpago/fondoRemate');
db['guardarSimulacionRequest'] = require('./mockup/fondoColectivo/reactivacionpago/guardarSimulacionRequest');
db['guardarSimulacionResponse'] = require('./mockup/fondoColectivo/reactivacionpago/guardarSimulacionResponse');
db['historialResponse'] = require('./mockup/fondoColectivo/reactivacionpago/historial');
db['informacionContratoResuelto'] = require('./mockup/fondoColectivo/reactivacionpago/informacionContratoResuelto');
db['inversionInmobiliaria']=require('./mockup/fondoColectivo/reactivacionpago/inversionInmobiliaria');
db['marcas']=require('./mockup/fondoColectivo/reactivacionpago/marcas');
db['modelos']=require('./mockup/fondoColectivo/reactivacionpago/modelos');
db['movimientoAdministrativo'] = require('./mockup/fondoColectivo/reactivacionpago/movimientoAdministrativo');
db['pagarObligacionaCuenta'] = require('./mockup/fondoColectivo/reactivacionpago/pagarObligacionaCuenta');
db['proximasAsambleas'] = require('./mockup/fondoColectivo/reactivacionpago/proximasAsambleas');
db['simular']=require('./mockup/fondoColectivo/reactivacionpago/simular');
db['simularMetodos']=require('./mockup/fondoColectivo/reactivacionpago/simular/metodos');
db['tipoBien'] = require('./mockup/fondoColectivo/reactivacionpago/tipoBien');
db['validarPagoGenerado'] = require('./mockup/fondoColectivo/reactivacionpago/validarPagoGenerado');
db['validarSimulacion'] = require('./mockup/fondoColectivo/reactivacionpago/validarSimulacion');
db['listaDeGrupos'] = require('./mockup/fondoColectivo/listaDeGrupos');
db['reactivacioncontrato'] = require('./mockup/fondoColectivo/reactivaciones');
db['reactivacionSummary'] = require('./mockup/fondoColectivo/reactivacionSummary');
db['recargaProductos']=require('./mockup/fondoColectivo/recargaProductos');
db['simuladorBusquedaPorContrato']=require('./mockup/logistica/simulador-menu/simulador');
db['simuladorBusquedaPorDatos']=require('./mockup/logistica/simulador-menu/simulador');
db['simuladorBusquedaPorDocumento']=require('./mockup/logistica/simulador-menu/simulador');
db['listarContratosPorPersona']=require('./mockup/logistica/simulador-menu/listar-contratos');
db['simuladorConceptos']=require('./mockup/logistica/simulador-financiamiento/conceptos');
db['simularFinanciamiento']=require('./mockup/logistica/simulador-financiamiento/simular-financiamiento');
db['simuladorAceptarCambio']=require('./mockup/logistica/simulador-financiamiento/conceptos');
db['simuladorSeleccionarContrato']=require('./mockup/logistica/simulador-menu/simulador');
db['simuladorIniciarDatos']=require('./mockup/logistica/simulador-menu/simuladorIniciarDatos');
db['simuladorCalcular']=require('./mockup/logistica/simulador-menu/simuladorCalcular');
db['simularFinanciamiento']=require('./mockup/logistica/simulador-menu/simularFinanciamiento');
db['contratoRecuperos']=require('./mockup/fondoColectivo/contratosRecuperos');
db['seguimientoEvaluacion']=require('./mockup/logistica/evaluacionCrediticia/seguimiento/seguimiento');
db['envioComite']=require('./mockup/logistica/evaluacionCrediticia/lista-documentos/envio-comite');
db['celulaTodos']=require('./mockup/administracion/celula-todos');
db['obtenerDatosPersona']= require('./mockup/reactivaciones/generar-contrato/obtener-informacion-personal.json');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    keepExtensions: true,
    uploadDir: __dirname + "/media",
    limit: 10000000, // 10M limit
    defer: true,
    extended: true
  })
);

app.get("/", (_req, res) => {
  res.json("Welcome to mockup");
});

app.put("/administracion/persona/natural/editarPersona", (_req, res) => {
  const key = validarPayload(_req.body, "logistica/evaluacionCrediticia/garante/nuevoRespaldo");
  if (key) {
    res.status(400).send(new APIError("400", `Campo: ${key} con problema`));
  } else {
    res.status(200).send("35435");
  }
});

app.post('/administracion/persona/reactivaciones/asociadosCabecera', (_req, res) => {
  if (Array.isArray(_req.body) && isNotEmpty(_req.body)) {
    res.status(200).send(db['asociadosCabecera']);
  } else {
    res.status(400).send(new APIError('400', `Ingrese un array de strings como payload`));
  }
});

app.post('/fondoColectivo/reactivacionpago/contrato/generar', (_req, res) => {
  const key = validarPayload(_req.body, 'fondoColectivo/reactivacionpago/contrato/generarRequest');
  if (key) {
    res.status(400).send(new APIError('400', `Campo: ${key} con problema`));
  } else {
    res.status(200).send(db['generar']);
  }
});

app.post('/fondoColectivo/reactivacionpago/contratoResueltoSimulacion/grupos', (_req, res) => {
  const key = validarPayload(_req.body, 'fondoColectivo/listaDeGruposRequest');
  if (key) {
    res.status(400).send(new APIError('400', `Campo: ${key} con problema`));
  } else {
    res.status(200).send(db['listaDeGrupos']);
  }
});

app.post('/fondoColectivo/reactivacionpago/contratoResueltoSimulacion/productos', (_req, res) => {
  const key = validarPayload(_req.body, 'fondoColectivo/recargaProductosRequest');
  if (key) {
    res.status(400).send(new APIError('400', `Campo: ${key} con problema`));
  } else {
    res.status(200).send(db['recargaProductos']);
  }
});

app.post('/fondoColectivo/reactivacionpago/guardarSimulacion', (_req, res) => {
  const key = validarPayload(_req.body, 'fondoColectivo/reactivacionpago/guardarSimulacionRequest');
  if (key) {
    res.status(400).send(new APIError('400', `Campo: ${key} con problema`));
  } else {
    res.status(200).send(db['guardarSimulacionResponse']);
  }
});

app.post('/fondoColectivo/reactivacionpago/eliminarPago', (_req, res) => {
  const key = validarPayload(_req.body, 'fondoColectivo/reactivacionpago/guardarSimulacionRequest');
  if (key) {
    res.status(400).send(db['eliminarPago']);
  } else {
   res.status(200).send(db['guardarSimulacionResponse']);
  }
});

app.post('/fondoColectivo/reactivacionpago/pagarObligacionaCuenta', (_req, res) => {
  const key = validarPayload(_req.body, 'fondoColectivo/reactivacionpago/pagarObligacionaCuentaRequest');
  if (key) {
    res.status(400).send(new APIError('400', `Campo: ${key} con problema`));
  } else {
    res.status(200).send(db['pagarObligacionaCuenta']);
  }
});

app.post('/fondoColectivo/reactivacionpago/simular', (_req, res) => {
  const key = validarPayload(_req.body, 'fondoColectivo/reactivacionpago/simularRequest');
  if (key) {
    res.status(400).send(new APIError('400', `Campo: ${key} con problema`));
  } else {
    res.status(422).send(new APIError('400', `El grupo seleccionado se encuentra avanzado y sobrepasa la deuda del certificado`));
  }
});

app.put('/fondoColectivo/reactivacionpago/simular', (_req, res) => {
  const key = validarPayload(_req.body, 'fondoColectivo/reactivacionpago/simularRequest');
  if (key) {
    res.status(400).send(new APIError('400', `Campo: ${key} con problema`));
  } else {
    res.status(200).send(db['simular']);
  }
});

app.post("/logistica/evaluacionCrediticia/bloqueContrato/:id/persona/natural", (_req, res) => {
  if (_req.params.id) {
    const key = validarPayload(_req.body, "logistica/evaluacionCrediticia/garante/nuevoRespaldo");
    if (key) {
      res.status(400).send(new APIError("400", `Campo: ${key} con problema`));
    } else {
      res.status(200).send("41353");
    }
  } else {
    res.status(400).send(new APIError("400", "Ingrese bloque contrato id"));
  }
});

app.use(routesAsync(db));

app.use(({ path }, res, next) => {
  const routeNames = Object.keys(routes);
  let statusCode = res.statusCode;

  if (!res.capturado) {
    for (let index = 0; index < routeNames.length; index++) {
      const name = routeNames[index];
      const fromPath = pathToRegexp(name);

      if (fromPath.exec(path)) {
        const dataName = routes[name];
        const data = db[dataName];
        if (data) {
          printStatus(path, statusCode);
          return res.json(data);
        }
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;

        res.status(statusCode).send(new APIError("", "No hay data para esta url"));
        printStatus(path, statusCode);

        return next();
      }
    }

    statusCode = httpStatus.NOT_FOUND;
    res.status(statusCode).send(new APIError("", "No existe ninguna ninguna referencia a esta url"));
  }
  if (!res.cargando) {
    printStatus(path, statusCode);

    return next();
  }
});

const ip = internalIp.v4();
const port = process.env.PORT || 3010;

app.listen(port, () => {
  console.log(`Los servicios mockup estan desplegados en:`);
  console.log();
  console.log(`  ${chalk.bold("Local:")}           http://localhost:${port}/`);
  console.log(`  ${chalk.bold("O en tu red:")}     http://${ip}:${port}/`);
  console.log();
});

function validarPayload(body, path) {
  const nuevoRespaldo = require(`./mockup/${path}.json`);
  return Object.keys(nuevoRespaldo)
    .map(value => {
      if (body[value]) {
      } else {
        return value;
      }
    })
    .filter(key => key)[0];
}
function isEmpty(obj) {
  if (!obj) {
    return true;
  }
  if (Array.isArray(obj)) {
    return obj.length === 0;
  }

  return Object.keys(obj).length === 0;
}

function isNotEmpty(obj) {
  return !isEmpty(obj);
}

module.exports = app;
