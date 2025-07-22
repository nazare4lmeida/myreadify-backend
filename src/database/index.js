const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const User = require('../models/User');
const Book = require('../models/Book');
const Review = require('../models/Review');
const Message = require('../models/Message');

let connection;

try {
  console.log('--- INICIANDO DIAGNÓSTICO DE CONEXÃO ---');
  console.log('Tentando conectar com a seguinte configuração:', JSON.stringify(dbConfig, null, 2));
  
  connection = new Sequelize(dbConfig);
  
  console.log('Objeto de conexão Sequelize criado com sucesso.');

} catch (error) {
  console.error('!!!!!! FALHA CRÍTICA AO CRIAR A INSTÂNCIA DO SEQUELIZE !!!!!!');
  console.error('NOME DO ERRO:', error.name);
  console.error('MENSAGEM DE ERRO:', error.message);
  console.error('STACK TRACE:', error.stack);
  console.error('--- FIM DO DIAGNÓSTICO DE CONEXÃO ---');
  
  throw error;
}

User.init(connection);
Book.init(connection);
Review.init(connection);
Message.init(connection);

Object.values(connection.models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(connection.models));

module.exports = connection;