const Sequelize = require('sequelize');
const config = require('../config/database');

const User = require('./User');
const Book = require('./Book');
const Review = require('./Review');

const models = [User, Book, Review];

const connection = new Sequelize(config);

// Inicializa todos os models
models.forEach((model) => model.init(connection));

// Executa os relacionamentos
models.forEach((model) => {
  if (model.associate) {
    model.associate(connection.models);
  }
});

module.exports = {
  connection,
  Sequelize,
  User,
  Book,
  Review
};
