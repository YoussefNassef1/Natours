const express = require('express');
const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');

const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');

const cors = require('cors');

const cookieParser = require('cookie-parser');

const xss = require('xss-clean');

// Start express app
const app = express();

// app.enable('trust proxy');
const compression = require('compression');
const morgan = require('morgan');
const AppError = require('./util/appError');
const globalErrorHandling = require('./controller/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewsRouter = require('./routes/viewsRoutes');
const bookingRouter = require('./routes/bookingRoutes');

// limit request
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this ip, please try again in an hour'
});
// 1) Middleware
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// implement cors
app.use(cors());
app.options('*', cors());
// set http secure
// app.use(helmet());

app.use(morgan('dev'));

// body parser reading data req.body
app.use(
  express.json({
    limit: '10kb'
  })
);
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// data sanitize against noSql Query injection
app.use(mongoSanitize());
// Data sanitization against xss
app.use(xss());

// clear duplicated
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'price',
      'maxGroupSize',
      'difficulty'
    ]
  })
);

app.use(compression());

app.use('/api', limiter);

// test middleware
// app.use((req, res, next) => {
//   console.log(req.cookies);
//   next();
// });

// 2) middleware routes
app.use('/', viewsRouter);
app.use('/api/v2/tours', tourRouter);
app.use('/api/v2/users', userRouter);
app.use('/api/v2/review', reviewRouter);
app.use('/api/v2/bookings', bookingRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandling);

module.exports = app;
