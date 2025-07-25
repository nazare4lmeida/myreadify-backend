const path = require('path');
const dotenv = require('dotenv');

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Configuração base, comum a todos os ambientes
const baseConfig = {
  dialect: process.env.DB_DIALECT || 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // ATENÇÃO: Verifique a variável de ambiente
  database: process.env.DB_NAME,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};

// Configuração específica para produção, que adiciona o SSL
const productionConfig = {
  ...baseConfig,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
};

// Escolhe a configuração correta baseada no ambiente
const config = process.env.NODE_ENV === 'production' ? productionConfig : baseConfig;

module.exports = config;