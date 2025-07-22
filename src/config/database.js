// src/config/database.js - VERSÃO FINAL E CORRETA

require('dotenv').config();

const config = {
  dialect: process.env.DB_DIALECT || 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};

// --- LÓGICA CRÍTICA PARA PRODUÇÃO ---
// Adiciona as configurações de SSL APENAS se o ambiente for de produção (na Vercel).
if (process.env.NODE_ENV === 'production') {
  config.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  };
}

module.exports = config;