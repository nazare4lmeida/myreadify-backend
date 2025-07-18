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


// --- Rotas de Admin ---
// Atualiza um livro (requer admin)
routes.put('/books/:id', authMiddleware, adminMiddleware, BookController.update);
// Aprova um livro (requer admin)
routes.patch('/books/:id/approve', authMiddleware, adminMiddleware, BookController.approve);
// Deleta um livro (requer admin)
routes.delete('/books/:id', authMiddleware, adminMiddleware, BookController.delete);


module.exports = routes;
