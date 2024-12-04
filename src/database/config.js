const { Sequelize } = require('sequelize');

const db = new Sequelize({
  dialect: process.env.DB_DIALECT,
  host: process.env.BD_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  logging: false,
});

module.exports = { db };
