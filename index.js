const express = require('express');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const morgan = require('morgan');
const cors = require('cors');
// const compression = require('compression');
const path = require('path');
const errorHandler = require('./middleware/error-handler');
// const AppError = require('./utils/app-error');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// app.set('trust proxy', 1);

connectDB();

app.use(cors());
app.options('*', cors());

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// access to uploaded files enabled
app.use('/uploads/', express.static('uploads'));
app.use(express.static(path.join(__dirname, 'dist')));

// Set security HTTP headers
app.use(helmet());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// logger morgan
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// limit requests per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// app.use(compression());

// Routes
app.use('/api/v1/articles', require('./routes/articles'));
app.use('/api/v1/topics', require('./routes/topics'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/auth', require('./routes/auth'));

app.get('/*', (_req, res) => {
  // next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use(errorHandler);

app.listen(process.env.PORT || 5000, () =>
  // eslint-disable-next-line no-console
  console.log('server running ', process.env.PORT),
);
