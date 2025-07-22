// src/config/database.js - VERSÃO CORRIGIDA E COMPLETA

require('dotenv').config();

module.exports = {
  dialect: process.env.DB_DIALECT || 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // --- ADIÇÃO CRÍTICA PARA PRODUÇÃO ---
  // Este bloco habilita a conexão segura (SSL) exigida por bancos de dados na nuvem.
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Importante para muitos provedores de nuvem
    }
  },
  // ------------------------------------

  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};