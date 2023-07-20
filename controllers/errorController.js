const AppError = require('../utils/appError');

// Creating A function on Cast Error
const handlecastErrorDb = function (err) {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateCodeDB = function (err) {
  // const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field: ${value}. Please input another value`;
  return new AppError(message, 400);
};

const handleValidationErroDB = function (err) {
  const errors = Object.values(err.errors).map(function (el) {
    return el.message;
  });
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTErrorDB = function () {
  return new AppError('Invalid token. Please login again!', 401);
};

const handleJWTExpiredError = function () {
  return new AppError('Your token has expired! Please login again.', 401);
};

const sendErrorDev = function (err, req, res) {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // RENDERED MESSAGE
  console.error('ERROR 😐😐', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!!!!!',
    msg: err.message,
  });
};

const sendErrorProduction = function (err, req, res) {
  // TESTED OPERATIONAL ERRORS: send message to ciient
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // RENDER WEBSITE
    // PROGRAMMING OF OTHER UNKNOWN ERROR: Don't leak details to client
    // log the error
    console.error('ERROR 😐😐', err);
    // send a generic message
    return res
      .status(500)
      .json({ status: 'error', message: 'Something went wrong!❌' });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!!!!!',
      msg: err.message,
    });
  }
  // RENDER WEBSITE
  // PROGRAMMING OF OTHER UNKNOWN ERROR: Don't leak details to client
  // log the error
  console.error('ERROR 😐😐', err);
  // send a generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!!!!!',
    msg: 'Please try again later',
  });
};

module.exports = function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);
    error.message = err.message;

    if (error.name === 'CastError') error = handlecastErrorDb(error);
    // DUPLICATE ERROR
    if (error.code === 11000) error = handleDuplicateCodeDB(error);
    // MONGOOSE ERROR
    if (error.name === 'ValidationError') error = handleValidationErroDB();
    // JWT ERROR
    if (error.name === 'JsonWebTokenError') error = handleJWTErrorDB();
    // XPIRED TOKEN ERROR
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);
    sendErrorProduction(error, req, res);
  }
};
