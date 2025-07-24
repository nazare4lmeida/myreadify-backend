const { Router } = require('express');

// Importa todos os arquivos de rotas
const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const bookRoutes = require('./bookRoutes');
const checkAuthRoutes = require('./checkAuthRoutes');
const contactRoutes = require('./contactRoutes');
const reviewRoutes = require('./reviewRoutes');

const routes = new Router();

// --- CORREÇÃO DE ORDEM ---

// 1. ROTAS PÚBLICAS: Ações que qualquer pessoa pode executar.
// Devem ser carregadas primeiro para não serem afetadas por middlewares de autenticação.
routes.use(contactRoutes);    // Enviar mensagem de contato
routes.use(authRoutes);       // Fazer login e registro
routes.use(bookRoutes);       // Ver livros
routes.use(reviewRoutes);     // Ver avaliações e criar novas (geralmente criar é protegido, mas depende da sua lógica)


// 2. ROTAS PROTEGIDAS: Ações que exigem login.
// Carregadas por último. O middleware de autenticação está dentro delas.
routes.use(checkAuthRoutes);  // Verifica se o token é válido
routes.use(adminRoutes);      // Ações de administrador

module.exports = routes;
