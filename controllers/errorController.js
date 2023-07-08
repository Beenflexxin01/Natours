const AppError = require('../utils/appError');

// Creating A function on Cast Error
const handlecastErrorDb = function (err) {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateCodeDB = function (err) {
  // const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  // console.log(value);
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

const sendErrorDev = function (err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProduction = function (err, res) {
  // TESTED OPERATIONAL ERRORS: send message to ciient
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // PROGRAMMING OF OTHER UNKNOWN ERROR: Don't leak details to client
  } else {
    // log the error
    console.error('ERROR 😐😐', err);
    // send a generic message
    res
      .status(500)
      .json({ status: 'error', message: 'Something went wrong!❌' });
  }
};

module.exports = function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);
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
    sendErrorProduction(error, res);
  }
};
