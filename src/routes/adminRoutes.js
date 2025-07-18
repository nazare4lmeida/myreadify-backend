// src/routes/adminRoutes.js

const { Router } = require('express');
const authMiddleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');
const AdminController = require('../controllers/AdminController');

const router = new Router();

// Aplica os middlewares de autenticação e de admin para TODAS as rotas neste arquivo
router.use('/admin', authMiddleware, adminMiddleware);

// Rota para listar resumos pendentes
router.get('/admin/pending-books', AdminController.listPending);

// Rota para aprovar/recusar um resumo
router.patch('/admin/books/:bookId/status', AdminController.updateBookStatus);

// Rota para listar TODOS os livros
router.get('/admin/all-books', AdminController.listAll);

// Rota para DELETAR um livro específico
router.delete('/admin/books/:bookId', AdminController.deleteBook);

module.exports = router;