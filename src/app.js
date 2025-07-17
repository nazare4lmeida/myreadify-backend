// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./database');

// 1. Importe suas rotas
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
  }

  routes() {
    // Rota de teste
    this.server.get('/', (req, res) => {
        res.json({ message: 'API MyReadify está no ar!' });
    });

    // 2. Use as rotas de autenticação com o prefixo /api
    this.server.use('/api', authRoutes);
    this.server.use('/api', bookRoutes);
    this.server.use('/api', reviewRoutes);
  }
}

module.exports = new App().server;