require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./database'); 

// Importação dos arquivos de rotas
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
    this.routes(); // A correção está dentro desta função
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
    // --- ROTA DE DIAGNÓSTICO E RAIZ ---
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

    this.server.get('/', (req, res) => {
        res.json({ message: 'API MyReadify está no ar!' });
    });
        
    // --- INÍCIO DA CORREÇÃO DE ORDEM ---

    // 1. ROTAS PÚBLICAS: Ações que qualquer pessoa pode fazer, sem precisar de login.
    // O formulário de contato e o login/registro são os principais exemplos.
    this.server.use('/api', contactRoutes);
    this.server.use('/api', authRoutes);

    // 2. ROTAS DE LEITURA PÚBLICA: Ações de visualização que não precisam de login.
    // Listar todos os livros, ver detalhes de um livro, e ver as avaliações de um livro.
    this.server.use('/api', bookRoutes);
    this.server.use('/api', reviewRoutes);
    
    // 3. ROTAS PROTEGIDAS: Ações que exigem um token de autenticação válido.
    // O middleware de autenticação está dentro desses arquivos de rotas.
    // Por estarem no final, eles não afetam as rotas públicas definidas acima.
    this.server.use('/api', checkAuthRoutes);
    this.server.use('/api', adminRoutes);

    // --- FIM DA CORREÇÃO DE ORDEM ---
  }
}

module.exports = new App().server;