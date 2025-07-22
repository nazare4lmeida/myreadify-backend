require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./database'); 
// Importe todas as suas rotas
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const checkAuthRoutes = require('./routes/checkAuthRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    // --- ROTA DE DIAGNÓSTICO ---
    this.server.get('/health-check', async (req, res) => {
      try {
        await sequelize.authenticate();
        res.json({ status: 'ok', message: 'Conexão com o banco de dados bem-sucedida!' });
      } catch (error) {
        console.error('FALHA NA CONEXÃO COM O BANCO:', error);
        res.status(500).json({
          status: 'error',
          message: 'Falha ao conectar com o banco de dados.',
          errorName: error.name,
          errorMessage: error.message,
        });
      }
    });
    // ------------------------------------

    this.server.get('/', (req, res) => {
        res.json({ message: 'API MyReadify está no ar!' });
    });
        
    this.server.use('/api', authRoutes);
    this.server.use('/api', contactRoutes);
    this.server.use('/api', bookRoutes);
    this.server.use('/api', reviewRoutes);
    this.server.use('/api', checkAuthRoutes);
    this.server.use('/api', adminRoutes);
  }
}

module.exports = new App().server;