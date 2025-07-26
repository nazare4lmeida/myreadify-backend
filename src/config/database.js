const dotenv = require('dotenv');
const path = require('path');

// Determina qual arquivo .env será usado com base no ambiente
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Exporta as configurações do Sequelize
module.exports = {
  dialect: process.env.DB_DIALECT || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || null,
  database: process.env.DB_NAME || 'myreadify',
  define: {
    timestamps: true,           // Cria automaticamente campos createdAt e updatedAt
    underscored: true,          // Usa snake_case nos nomes das colunas (ex: user_id)
    underscoredAll: true,       // Aplica também em associações e campos automáticos
  },
  logging: false,               // Evita logs SQL no terminal (pode ativar em dev)
};
