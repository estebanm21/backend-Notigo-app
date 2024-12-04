const User = require('./user.model');
const Store = require('./store.model');
const Subscription = require('./subscription.model');

const initModel = () => {
  // Un usuario puede tener muchas suscripciones
  User.hasMany(Subscription, { foreignKey: 'userId' });

  // Un store puede tener muchas suscripciones
  Store.hasMany(Subscription, { foreignKey: 'storeId' });

  // Una suscripción pertenece a un usuario
  Subscription.belongsTo(User, { foreignKey: 'userId' });

  // Una suscripción pertenece a un store
  Subscription.belongsTo(Store, { foreignKey: 'storeId' });

  console.log(
    'Associations established between User, Store, and Subscription.'
  );
};

module.exports = {
  initModel,
};
