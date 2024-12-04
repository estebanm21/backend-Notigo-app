const admin = require('firebase-admin');

// FUNCION QUE ENVIA NOTIFICACION AL DISPOSITIVO
const sendPushNotification = async (token, notification) => {
  const message = {
    notification: {
      title: notification.title,
      body: notification.body,
    },
    data: {
      imageUrl: notification.imgUrl,
    },
    token,
  };

  try {
    await admin.messaging().send(message);
    console.log('Notificación enviada:', message);
  } catch (error) {
    console.error('Error enviando notificación:', error);
  }
};

module.exports = sendPushNotification;
