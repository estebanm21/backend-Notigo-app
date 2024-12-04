const express = require('express');
const { signUp, signIn } = require('../controller/user.auth.controller');

const {
  createUserValidation,
  loginUserValidation,
} = require('../middlewares/validations.middlewares');
const {} = require('../middlewares/auth.middlewares');
// const { validUser } = require('../middlewares/user.middlewares');

const router = express.Router();
// RUTAS DE REGISTRO E INCIO DE SESION DEL USUARIO
router.post('/signup', createUserValidation, signUp);
router.post('/signin', loginUserValidation, signIn);

module.exports = router;
// api/v1/auth/user/signup