// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
require('./database');

// Importe todas as suas rotas
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const checkAuthRoutes = require('./routes/checkAuthRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes'); // <-- Sua rota de contato

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
    this.server.get('/', (req, res) => {
        res.json({ message: 'API MyReadify está no ar!' });
    });
        
    // --- ROTAS PÚBLICAS (ou com partes públicas) ---
    // Estas não exigem token para todas as suas funcionalidades.
    this.server.use('/api', authRoutes);      // Login/Registro
    this.server.use('/api', contactRoutes);   // <-- CORREÇÃO: Movido para cá. Agora é processado antes das rotas privadas.
    this.server.use('/api', bookRoutes);      // Listar/ver livros

    // --- ROTAS PRIVADAS ---
    // Estas rotas geralmente exigem um token de autenticação.
    this.server.use('/api', reviewRoutes);
    this.server.use('/api', checkAuthRoutes);
    this.server.use('/api', adminRoutes);
  }
}

module.exports = new App().server;