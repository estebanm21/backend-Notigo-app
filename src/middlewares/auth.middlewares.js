const AppError = require('../helpers/AppError');
const catchAsync = require('../helpers/catchAsync');
const jwt = require('jsonwebtoken');
const User = require('../model/user.model');
const { promisify } = require('util');
const Store = require('../model/store.model');

// ESTA FUNCION VERIFICA QUE EL USUARIO ESTE AUNTENTICADO PARA REALIZAR CIERTAS ACCIONES O ACCEDAR A UNA RUTA QUE REQUIERE AUTENTICACION
const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in!, please log in the to get access'),
      401
    );
  }
  // decodificar el token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEDD
  );

  //   buscar el usuario y validar si existe
  const user = await User.findOne({
    where: {
      id: decoded.id,
      status: 'active',
    },
  });

  if (!user) {
    return next(
      new AppError('the owner of this token is not longer available', 401)
    );
  }

  // validar el tiempo en que se cambio la contraseña para saber si el token generado fue generado despues de cambiar la contraseña
  if (user.passwordChangeAt) {
    console.log(user.passwordChangeAt.getTime());
    const changeTimeStamp = parseInt(
      user.passwordChangeAt.getTime() / 1000,
      10
    );
    if (decoded.iat < changeTimeStamp) {
      return next(
        new AppError('User recently changed password! please login again', 401)
      );
    }
    console.log('token', decoded.iat);
    console.log('pass', changeTimeStamp);
  }

  // Adjuntar el  usuario en sesion
  req.sessionUser = user;

  next();
});

// ESTA FUNCION VERIFICA QUE EL USUARIO ESTE AUNTENTICADO PARA REALIZAR CIERTAS ACCIONES O ACCEDAR A UNA RUTA QUE REQUIERE AUTENTICACION
const protectStore = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in!, please log in the to get access'),
      401
    );
  }
  // decodificar el token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEDD
  );

  //   buscar el usuario y validar si existe
  const store = await Store.findOne({
    where: {
      id: decoded.id,
      status: 'active',
    },
  });

  if (!store) {
    return next(
      new AppError('the owner of this token is not longer available', 401)
    );
  }

  // validar el tiempo en que se cambio la contraseña para saber si el token generado fue generado despues de cambiar la contraseña
  if (store.passwordChangeAt) {
    console.log(store.passwordChangeAt.getTime());
    const changeTimeStamp = parseInt(
      store.passwordChangeAt.getTime() / 1000,
      10
    );
    if (decoded.iat < changeTimeStamp) {
      return next(
        new AppError('User recently changed password! please login again', 401)
      );
    }
    console.log('token', decoded.iat);
    console.log('pass', changeTimeStamp);
  }

  // Adjuntar el  usuario en sesion
  req.sessionStore = store;

  next();
});

// ESTA FUNCION VERIFICA QUE USUARIO ESTA EN SESION Y CON BASE A ESO LE PERMITE REALIZAR SOLO LAS ACCIONES PARA LAS QUE ESTA AUTORIZADO
const protectAccountOwner = (req, res, next) => {
  const { sessionUser } = req;
  if (req.body.userId && req.body.userId !== sessionUser.id) {
    return next(new AppError('yo do not own this account ', 401));
  }
  next();
};

// ESTA FUNCION PERMITE QUE SOLO LOS ROLES ESPESIFICADOS PUEDAN REALIZAR UNA ACCION EN LA RUTA EN LA QUE SE COLOCA
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.sessionUser.role)) {
      return next(
        new AppError('you do not have permission to permorm this action', 403)
      );
    }
    next();
  };
};

module.exports = {
  protect,
  protectAccountOwner,
  restrictTo,
  protectStore,
};
