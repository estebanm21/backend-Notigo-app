const AppError = require('../helpers/AppError');
const Error = require('../model/error.molde');
const handleCastError22001 = () =>
  new AppError('the numbers of characters is greater than expected', 400);

const handleCastError22P02 = () =>
  new AppError('Invalid Data Type in database', 400);

const handleCastError23505 = () =>
  new AppError('Duplicate field value, please another value', 400);

const handleJWTError = () =>
  new AppError('invalid token. please login again!', 401);

const handleJWTExpiredError = () =>
  new AppError(' Your token has expired. please login again!', 401);

const sendErrorDev = (err, res) => {
  Error.create({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
  console.log(err);
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    err: err,
  });
};

const sendErrorProd = (err, res) => {
  // errores operacionales se envian al cliente
  console.log(err);
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // errores  de programacion o desconocidos, no se le envial el detalle del error al cliente
    return res.status(500).json({
      status: 'Fail',
      message: 'Something went very wrong',
    });
  }
};

const globalErrohandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    let error = err;
    if (err.parent?.code === '22001') error = handleCastError22001();
    if (err.parent?.code === '22P02') error = handleCastError22P02();
    if (err.parent?.code === '23505') error = handleCastError23505();
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrorProd(error, res);
  }
};

module.exports = globalErrohandler;
