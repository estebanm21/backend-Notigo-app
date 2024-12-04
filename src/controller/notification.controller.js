const Subscription = require('../model/subscription.model');
const catchAsync = require('../helpers/catchAsync');
const sendNotification = require('../services/notification.services');
const { storage } = require('../helpers/firebase'); // Asegúrate de tener la configuración de Firebase
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

// PARA CREAR Y ENVIAR LA NOTIFIACION
const sendNotificationToSubscribers = catchAsync(async (req, res, next) => {
  const { storeId, title, body } = req.body;
  const notification = { title, body };

  if (!title || !body) {
    return next(new AppError('Title and body are required', 400));
  }

  // Verificar si se subió una imagen
  let imgUrl = null;
  if (req.file) {
    const imgRef = ref(
      storage,
      `notifications/${Date.now()}-${req.file.originalname}`
    );

    // Subir la imagen a Firebase Storage
    await uploadBytes(imgRef, req.file.buffer);

    // Obtener la URL de descarga de Firebase
    imgUrl = await getDownloadURL(imgRef);
  }

  // Obtener todas las suscripciones de la tienda
  const subscriptions = await Subscription.findAll({ where: { storeId } });

  await Promise.all(
    subscriptions.map(async (sub) => {
      await sendNotification(sub.userId, storeId, { ...notification, imgUrl });
    })
  );

  return res
    .status(200)
    .json({ status: 'success', message: 'Notifications sent' });
});

module.exports = {
  sendNotificationToSubscribers,
};
