// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // Módulo 'path' do Node.js
require('./database');

// 1. Importe todas as suas rotas
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
    // <-- NOVO MIDDLEWARE PARA ARQUIVOS ESTÁTICOS
    // Para que as imagens de capa possam ser acessadas pelo navegador
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    // Rota de teste
    this.server.get('/', (req, res) => {
        res.json({ message: 'API MyReadify está no ar!' });
    });

    // 2. Use todas as rotas com o prefixo /api
    this.server.use('/api', authRoutes);
    this.server.use('/api', bookRoutes);
    this.server.use('/api', reviewRoutes);
  }
}

module.exports = new App().server;