const Subscription = require('../model/subscription.model');
const Store = require('../model/store.model');
const catchAsync = require('../helpers/catchAsync');
const AppError = require('../helpers/AppError');
const { getDownloadURL, ref } = require('firebase/storage');
const { storage } = require('../helpers/firebase');

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
  const subscription = await Subscription.create({ userId, storeId });

  return res.status(201).json({
    status: 'success',
    message: 'Subscribed successfully',
    subscription,
  });
});

const findAllStoresWithSubscriptions = catchAsync(async (req, res, next) => {
  const userId = req.sessionUser.id;

  // Obtener las suscripciones del usuario
  const subscriptions = await Subscription.findAll({
    where: { userId }, // Filtrar por el ID del usuario
  });

  // Obtener los ids de las tiendas a las que está suscrito el usuario
  const subscribedStoreIds = subscriptions.map((sub) => sub.storeId);

  if (subscribedStoreIds.length === 0) {
    return res.status(200).json({
      status: 'success',
      stores: [], // Si no está suscrito a ninguna tienda, devolver un array vacío
    });
  }

  // Obtener las tiendas a las que está suscrito el usuario
  const stores = await Store.findAll({
    where: {
      id: subscribedStoreIds, // Filtramos solo las tiendas a las que está suscrito
      status: 'active', // Aseguramos que solo estamos buscando tiendas activas
    },
  });

  const storesPromise = stores.map(async (store) => {
    const imgRef = ref(storage, store.profileImgUrl);
    const url = await getDownloadURL(imgRef);
    store.profileImgUrl = url;
    return store;
  });

  const storeResolved = await Promise.all(storesPromise);

  // Añadir el campo isSubscribed (aunque siempre será true porque estamos filtrando solo las suscripciones)
  const storesWithSubscription = storeResolved.map((store) => {
    store.isSubscribed = true;
    return store;
  });

  return res.status(200).json({
    status: 'success',
    stores: storesWithSubscription, // Aquí devolvemos solo las tiendas a las que está suscrito el usuario
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
  findAllStoresWithSubscriptions,
  unsubscribeFromStore,
};
