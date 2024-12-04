const express = require('express');
const morgan = require('morgan');

// RUSTAS IMPORTADAS
const routerAuthUser = require('./routes/user.auth.routes');
const routerAuthStore = require('./routes/store.auth.routes');
const routerSuscription = require('./routes/suscription.routes');
const routerUser = require('./routes/user.routes');
const routerStore = require('./routes/store.routes');
const routerNotifications = require('./routes/notifications.routes');

const sanatizater = require('perfect-express-sanitizer');

const globalErrohandler = require('./controller/error.controller');
const AppError = require('./helpers/AppError');
const cors = require('cors');
const hpp = require('hpp');
const helmet = require('helmet');
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(hpp());

app.use(
  sanatizater.clean({
    xss: true,
    noSql: true,
    sql: false, // obligatoriamente debe ir en false
  })
);

app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use('/api/v1/auth/user', routerAuthUser);
app.use('/api/v1/auth/store', routerAuthStore);
app.use('/api/v1/suscription', routerSuscription);
app.use('/api/v1/user', routerUser);
app.use('/api/v1/store', routerStore);
app.use('/api/v1/notification', routerNotifications);

app.all('*', (req, res, next) => {
  return next(
    new AppError(`can´t  find ${req.originalUrl} on this server`, 404)
  );
});

app.use(globalErrohandler);

module.exports = { app };
