// src/config/database.js - VERSÃO MAIS ROBUSTA

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
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
};

// --- LÓGICA INTELIGENTE ---
// Se uma DATABASE_URL for encontrada nas variáveis de ambiente (padrão da Vercel/Heroku),
// use-a. Caso contrário, use as variáveis separadas (para desenvolvimento local).
module.exports = process.env.DATABASE_URL
  ? {
      ...config,
      // O Sequelize pode usar a URL diretamente, mas vamos garantir que o SSL seja aplicado
      // passando a URL e as opções de dialeto.
      url: process.env.DATABASE_URL,
    }
  : config;