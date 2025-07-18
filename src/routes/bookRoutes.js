const { Router } = require('express');
const multer = require('multer');
const multerConfig = require('../config/multer');

const BookController = require('../controllers/BookController');
const authMiddleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');

const routes = new Router();
const upload = multer(multerConfig);

// --- Rotas Públicas ---
// Lista todos os livros APROVADOS
routes.get('/books', BookController.index);
// Mostra um livro específico pelo ID
routes.get('/books/:id', BookController.show);

// --- Rotas de Usuário Autenticado ---
// Rota para o usuário enviar um novo livro para avaliação
routes.post('/books', authMiddleware, upload.single('coverImage'), BookController.store);
// Rota para o usuário listar apenas os seus próprios envios
routes.get('/my-books', authMiddleware, BookController.listMyBooks);

module.exports = routes;
