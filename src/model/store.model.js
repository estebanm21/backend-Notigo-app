const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

const Store = db.define('stores', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  categorie: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },

  locationRadius: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  profileImgUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'profile_img_url',
  },
  businessImgUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'business_img_url',
  },

  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active',
  },
});

module.exports = Store;
