const User = require('../model/user.model');
const Subscription = require('../model/subscription.model');
const sendPushNotification = require('../helpers/sendPushNotification');

const sendNotification = async (userId, storeId, notification) => {
  // Verificar si el usuario está suscrito a la tienda
  const subscription = await Subscription.findOne({
    where: { userId, storeId },
  });

  if (subscription) {
    // Obtener el usuario para su token FCM
    const user = await User.findByPk(userId);

    if (user && user.token) {
      // Lógica para enviar notificación push
      await sendPushNotification(user.token, notification);
      console.log('Notificación enviada al usuario:', userId);
    } else {
      console.log('Token FCM no encontrado para el usuario:', userId);
    }
  } else {
    console.log('Usuario no suscrito a esta tienda.');
  }
};

module.exports = sendNotification;
