const dotenv = require('dotenv');
const path = require('path');

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const baseConfig = {
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
  logging: false,
};

if (process.env.DATABASE_URL) {
  module.exports = {
    ...baseConfig,
    dialect: 'postgres',
    url: process.env.DATABASE_URL,
  };
} else {
  module.exports = {
    ...baseConfig,
    dialect: process.env.DB_DIALECT || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || 'myreadify',
  };
}
