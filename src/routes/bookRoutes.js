// src/routes/bookRoutes.js

const { Router } = require('express');
const multer = require('multer');
const multerConfig = require('../config/multer');

const BookController = require('../controllers/BookController');
const authMiddleware = require('../middlewares/auth');

const routes = new Router();
const upload = multer(multerConfig);

// --- Rotas Públicas ---
// Lista todos os livros aprovados (com paginação)
routes.get('/books', BookController.index);

// Mostra os detalhes de um livro específico pelo slug
routes.get('/books/:slug', BookController.show);


// --- Rotas de Usuário Autenticado ---
// Usa o middleware de autenticação para todas as rotas abaixo
routes.use(authMiddleware);

// Cria um novo livro (requer upload de imagem)
routes.post('/books', upload.single('coverImage'), BookController.store);

// --- ROTA DE ATUALIZAÇÃO (NOVA) ---
// Atualiza um livro existente (por exemplo, adicionando um resumo).
// Não precisa do 'upload' de imagem, pois estamos atualizando apenas os dados de texto.
routes.put('/books/:slug', BookController.update);

// Lista os livros enviados pelo usuário logado
routes.get('/my-books', BookController.listMyBooks);

module.exports = routes;