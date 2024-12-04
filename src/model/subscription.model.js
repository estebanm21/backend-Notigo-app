const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

const Subscription = db.define('subscriptions', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // Asegúrate de que el nombre de la tabla sea correcto
      key: 'id',
    },
  },
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'stores', // Asegúrate de que el nombre de la tabla sea correcto
      key: 'id',
    },
  },
  subscriptionDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});
module.exports = Subscription;
