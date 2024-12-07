const express = require('express');
const {
  subscribeToStore,
  findAllStoresWithSubscriptions,
  unsubscribeFromStore,
} = require('../controller/suscription.controller');
const {
  protect,
  protectAccountOwner,
} = require('../middlewares/auth.middlewares');

const router = express.Router();

router.post('/subscribe', protect, protectAccountOwner, subscribeToStore);
router.get(
  '/mysubscriptions',
  protect,
  protectAccountOwner,
  findAllStoresWithSubscriptions
);
router.post('/unsubscribe', protect, protectAccountOwner, unsubscribeFromStore);

module.exports = router;
