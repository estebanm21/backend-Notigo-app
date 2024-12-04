const express = require('express');
const {
  protectStore,
  protect,
  restrictTo,
} = require('../middlewares/auth.middlewares');
const {
  findAllStores,
  findOneStore,
  updateStore,
  deleteStore,
  uploadBusinessImage,
} = require('../controller/store.controller');
const { validStore } = require('../middlewares/store.middlewares');
const {
  sendNotificationToSubscribers,
} = require('../controller/notification.controller');
const { upload } = require('../helpers/multer');

const router = express.Router();

router.patch(
  '/upload-business-img/:id',
  upload.single('businessImgUrl'),
  protectStore,
  validStore,
  uploadBusinessImage
);
router.patch('/:id', protectStore, validStore, updateStore);
router.get('/', findAllStores);
router.get('/:id', validStore, findOneStore);

router.delete('/:id', protect, validStore, deleteStore, restrictTo('admin'));

module.exports = router;
