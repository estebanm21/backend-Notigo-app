const express = require('express');
const {
  findOneUser,
  findAllUsers,
  deleteUser,
  updateUser,
  findSessionUser,
} = require('../controller/user.controller');
const { validUser } = require('../middlewares/user.middlewares');
const {
  restrictTo,
  protect,
  protectAccountOwner,
} = require('../middlewares/auth.middlewares');
const {
  updateUserValidation,
} = require('../middlewares/validations.middlewares');

const router = express.Router();

router.patch(
  '/:id',
  protect,
  protectAccountOwner,
  updateUserValidation,
  validUser,
  updateUser
);

router.get('/me', protect, findSessionUser);

router.use(protect, restrictTo('admin'));
router.get('/', findAllUsers);
router.get('/:id', validUser, findOneUser);
router.delete('/:id', validUser, deleteUser);

module.exports = router;
