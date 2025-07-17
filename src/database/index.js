// src/database/index.js
const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

// Importando os modelos
const User = require('../models/User');
const Book = require('../models/Book');
const Review = require('../models/Review');

const connection = new Sequelize(dbConfig);

// Inicializando os modelos
User.init(connection);
Book.init(connection);
Review.init(connection);

Object.values(connection.models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(connection.models));

module.exports = connection;