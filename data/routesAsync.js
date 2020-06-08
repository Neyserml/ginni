const httpStatus = require('http-status');
const pathToRegexp = require('path-to-regexp');
const APIError = require('./APIError');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const printStatus = require('./printStatus');

const TOKEN_USER_1 = '123';
const TOKEN_USER_2 = '987';

const getTokenByHeader = (headers) => {
  return headers.authorization.replace('Bearer ', '');
};

const routesAsync = handleRoutesAsync => db => (req, res, next) => {
  const {
    path
  } = req;
  handleRoutesAsync.forEach((route) => {
    const fromPath = pathToRegexp(route.path);
    const pathRegexp = fromPath.exec(path);

    if (pathRegexp) {
      res.capturado = true;
      route.callback(db, pathRegexp, req, res);
      if (!res.cargando) {
        next();
      }
    }
  });
  next();
};

const inicioSesionAsync = {
  path: '/administracion/autentificacion/login',
  callback: (db, pathRegexp, req, res) => {
    const data = req.body;
    let status;
    let json;
    const nombreUsuario = data.nombreUsuario.toLowerCase();
    switch (nombreUsuario) {
      case 'ok':
        status = httpStatus.OK;
        json = db['login'];
        json.token = TOKEN_USER_1;
        break;
      case 'user':
        status = httpStatus.OK;
        json = db['login'];
        json.token = TOKEN_USER_2;
        break;
      case 'expirado':
        status = httpStatus.FORBIDDEN;
        json = new APIError('ginni-012', 'Ocurrio un error');
        break;
      case 'bloqueado':
        status = httpStatus.FORBIDDEN;
        json = new APIError('ginni-001', 'Ocurrio un error');
        break;
      case 'inactivo':
        status = httpStatus.UNAUTHORIZED;
        json = new APIError('ginni-004', 'Esta cuenta esta desactivada.');
        break;
      default:
        status = httpStatus.UNAUTHORIZED;
        json = new APIError('ginni-004', 'Usuario y/o contraseña incorrecta.');
        break;
    }
    res.status(status).send(json);
  }
};

const perfilesAsync = {
  path: '/administracion/autentificacion/perfiles/',
  callback: (db, pathRegexp, req, res) => {
    let status;
    let json;
    switch (getTokenByHeader(req.headers)) {
      case TOKEN_USER_1:
        status = httpStatus.UNAUTHORIZED;
        json = {
          'error': 'invalid_token',
          'error_description': 'ded1d355-65d8-4e0d-8c6d-853914ba46b8'
        };
        break;
      default:
        status = httpStatus.OK;
        json = db['perfiles'];
        break;
    }
    res.status(status).send(json);
  }
};

const personalAsync = {
  path: '/administracion/persona/:id/informacionpersonal',
  callback: (db, pathRegexp, req, res) => {
    let json;
    switch (pathRegexp[1]) {
      case '446616':
        json = db.informacionpersonaljuridico;
        break;
      default:
        json = db.informacionpersonal;
        break;
    }
    res.status(httpStatus.OK).send(json);
  }
};

const tipoPersonaAsync = {
  path: '/administracion/persona/:id/tipo',
  callback: (db, pathRegexp, req, res) => {
    let json;
    switch (pathRegexp[1]) {
      case '446616':
        json = {
          data: 'JURIDICO'
        };
        break;
      default:
        json = {
          data: 'NATURAL'
        };
        break;
    }
    res.status(httpStatus.OK).send(json);
  }
};

const usuarioAsync = {
  path: '/administracion/persona/usuario',
  callback: (db, pathRegexp, req, res) => {
    let json;
    switch (getTokenByHeader(req.headers)) {
      case TOKEN_USER_1:
        json = db.usuario_1;
        break;
      case TOKEN_USER_2:
        json = db.usuario_2;
        break;
    }
    res.status(httpStatus.OK).send(json);
  }
};

const bandejasAsync = {
  path: '/fondoColectivo/contrato/bandeja',
  callback: (db, pathToRegexp, req, res) => {
    let json;
    switch (db.usuario_1.perfil) {
      case 'ROLE_ASISTENTE_RECUPEROS':
        json = db.bandejaGeneral;
        break;
      default:
        json = db.bandejaFuncionario;
        break;
    }
    res.status(httpStatus.OK).send(json);
  }
};

function archivosPermitos(fileName) {
  const regex = /[\/.](gif|jpg|jpeg|tiff|png|pdf)$/i;
  return regex.test(fileName);
}

function esPDF(fileName) {
  const regex = /[\/.](pdf)$/i;
  regex.test(fileName);
}

const cargarArchivoAsync = {
  path: '/evaluacion-crediticia/archivo',
  callback: (_db, pathRegexp, req, res) => {
    res.cargando = true;
    const listFiles = [];

    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '/uploads');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(_field, file) {
      const pathFile = path.join(form.uploadDir, file.name);
      if (archivosPermitos(file.name)) {
        fs.rename(file.path, pathFile, () => {
        });
        listFiles.push(pathFile);
      } else {
        return responseAsync(req, res, httpStatus.FORBIDDEN, new APIError('ginni-202', 'Solo esta permitido imágenes o pdf'));
      }
    });

    // log any errors that occur
    form.on('error', function(_err) {
      console.log(_err);
      responseAsync(req, res, httpStatus.FORBIDDEN, new APIError());
    });

    form.on('progress', function(bytesReceived, bytesExpected) {
      console.log(((bytesReceived / bytesExpected) * 100).toFixed(2) + '% uploaded');
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
      if (!res.finished) {
        console.log('Done!');
        responseAsync(req, res, httpStatus.OK, listFiles.map(item => ({
          esPDF: esPDF(item),
          path: item
        })));
      }
    });

    // parse the incoming request containing the form data
    form.parse(req);
  }
};

function responseAsync(req, res, statusCode, body) {
  const path = req.path;

  printStatus(path, statusCode);
  res.status(statusCode).send(body);
}

module.exports = routesAsync([inicioSesionAsync, bandejasAsync, tipoPersonaAsync, perfilesAsync, usuarioAsync, personalAsync, cargarArchivoAsync]);
