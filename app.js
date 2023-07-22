const path = require('path');
// After installing express dependencies using npm install express
const express = require('express');
// After installing morgan dependencies using npm install morgan
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const monogSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const cookieParser = require('cookie-parser');
const compression = require('compression');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// Import routes from tour Router
const tourRouter = require('./Routes/tourRoute');
const userRouter = require('./Routes/userRoute');
const reviewRouter = require('./Routes/reviewRoute');
const bookingsRouter = require('./Routes/bookingsRoute');
const bookingsController = require('./controllers/bookingsController');
const viewRouter = require('./Routes/viewRoute');

const app = express();

// app.enable('trust proxy');
app.set('trust proxy');
// app.get('/ip', (request, response) => response.send(request.ip));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
// GLOBAL MIDDLEWARES
// Set security HTTP headers

app.use(cors());
// Access-Control-Allow-Origin: *

// Allow all options
app.options('*', cors());

app.use(helmet.crossOriginEmbedderPolicy({ policy: 'credentialless' }));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again in an hour',
});

app.use('/api', limiter);

// Stripe Webhook
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingsController.webhookCheckout
);

// Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));

// Making the traditional way of updating the user data work as expected.
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Related to making the cookie work
app.use(cookieParser());

// Data Sanitization against NOSQL query injection
app.use(monogSanitize());

// Data Sanitization against XSS (cross site scripting)
app.use(xss());

// Prevent parameter pollution.
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingQuantity',
      'maxGroup',
      'difficulty',
      'price',
    ],
  })
);

app.use(compression());

// Test middleware
app.use(function (req, res, next) {
  req.requestTime = new Date().toISOString();

  next();
});

// MOUNTING ROUTERS
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingsRouter);

// IMPLEMENTING ROUTE HANDLER MIDDLEWARE
app.all('*', function (req, res, next) {
  next(new AppError(`Can't find ${req.originalUrl} on this server!, 404`));
});

// IMPLEMENTING A GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
