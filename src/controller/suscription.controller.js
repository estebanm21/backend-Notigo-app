const Subscription = require('../model/subscription.model');
const Store = require('../model/store.model');
const catchAsync = require('../helpers/catchAsync');
const AppError = require('../helpers/AppError');

// Función para suscribir al usuario a una tienda
const subscribeToStore = catchAsync(async (req, res, next) => {
  const { storeId } = req.body;
  const userId = req.sessionUser.id; // Cambiar a sessionUser

  // Verificar si ya está suscrito
  const existingSubscription = await Subscription.findOne({
    where: { userId, storeId },
  });

  if (existingSubscription) {
    return next(new AppError('You are already subscribed to this store', 400));
  }

  // Crear la nueva suscripción
  const subscription = await Subscription.create({
    userId,
    storeId,
  });

  return res.status(201).json({
    status: 'success',
    message: 'Subscribed successfully',
    subscription,
  });
});

// Función para obtener las suscripciones del usuario
const getSubscriptions = catchAsync(async (req, res, next) => {
  const userId = req.sessionUser.id;

  // Obtener todas las tiendas a las que el usuario está suscrito
  const subscriptions = await Subscription.findAll({
    where: { userId },
    include: [{ model: Store, attributes: ['id', 'name', 'email', 'address'] }],
  });

  return res.status(200).json({
    status: 'success',
    subscriptions,
  });
});

//ELIMINAR SUSCRIPCION DE UNA TIENDA
const unsubscribeFromStore = catchAsync(async (req, res, next) => {
  const { storeId } = req.body;
  const userId = req.sessionUser.id;

  // Verificar si el usuario está suscrito a la tienda
  const subscription = await Subscription.findOne({
    where: { userId, storeId },
  });

  // Si no está suscrito, retornar un error
  if (!subscription) {
    return next(new AppError('You are not subscribed to this store', 400));
  }

  // Eliminar la suscripción
  await Subscription.destroy({
    where: { userId, storeId },
  });

  return res.status(204).json({
    status: 'success',
    message: 'Unsubscribed successfully',
  });
});

module.exports = {
  subscribeToStore,
  getSubscriptions,
  unsubscribeFromStore,
};
