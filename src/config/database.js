// src/config/database.js
require('dotenv').config();

module.exports = {
  dialect: process.env.DB_DIALECT || 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  define: {
    timestamps: true, // Cria os campos `createdAt` e `updatedAt` automaticamente
    underscored: true, // Converte camelCase para snake_case nas colunas do DB
    underscoredAll: true,
  },
};