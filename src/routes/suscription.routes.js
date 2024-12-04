const express = require('express');
const {
  subscribeToStore,
  getSubscriptions,
  unsubscribeFromStore,
} = require('../controller/suscription.controller');
const {
  protect,
  protectAccountOwner,
} = require('../middlewares/auth.middlewares');

const router = express.Router();

router.post('/subscribe', protect, protectAccountOwner, subscribeToStore);
router.get('/mysubscriptions', protect, protectAccountOwner, getSubscriptions);
router.delete(
  '/unsubscribe',
  protect,
  protectAccountOwner,
  unsubscribeFromStore
);

module.exports = router;
