const express = require('express');

const { protectStore } = require('../middlewares/auth.middlewares');
const { upload } = require('../helpers/multer');
const {
  sendNotificationToSubscribers,
} = require('../controller/notification.controller');

const router = express.Router();
router.use(protectStore);
router.post(
  '/notify-subscribers',
  upload.single('notificationImgUrl'),
  sendNotificationToSubscribers
);

module.exports = router;
