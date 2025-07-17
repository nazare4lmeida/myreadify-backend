// src/routes/bookRoutes.js
const { Router } = require('express');
const BookController = require('../controllers/BookController');
const authMiddleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');

const routes = new Router();

// Rotas Públicas (leitura)
routes.get('/books', BookController.index);
routes.get('/books/:id', BookController.show);
routes.patch('/books/:id/approve', authMiddleware, adminMiddleware, BookController.approve);
routes.delete('/books/:id', authMiddleware, adminMiddleware, BookController.delete);
routes.put('/books/:id', authMiddleware, adminMiddleware, BookController.update);

// Rotas Protegidas (requerem login)
// Apenas usuários logados podem enviar novos resumos
routes.post('/books', authMiddleware, BookController.store);

// Rotas de Admin (no futuro, protegeremos com um middleware de admin)
routes.patch('/books/:id/approve', BookController.approve);

module.exports = routes;