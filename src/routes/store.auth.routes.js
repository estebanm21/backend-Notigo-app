const express = require('express');
const { upload } = require('../helpers/multer');
const {
  signInStore,
  signUpStore,
} = require('../controller/store.auth.controller');
const {
  createStoreValidation,
  loginUserValidation,
} = require('../middlewares/validations.middlewares');

const router = express.Router();

router.post(
  '/signup',
  upload.single('profileImgUrl'), // Esto permite la subida de una sola imagen
  createStoreValidation,
  signUpStore
);
router.post('/signin', loginUserValidation, signInStore);

module.exports = router;
