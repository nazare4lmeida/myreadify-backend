// src/routes/adminRoutes.js

const { Router } = require('express');
const authMiddleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');
const AdminController = require('../controllers/AdminController');

const router = new Router();

router.use('/admin', authMiddleware, adminMiddleware);

// Rotas para aprovação (suas rotas existentes)
router.get('/admin/pending-books', AdminController.listPending);
router.patch('/admin/books/:bookId/status', AdminController.updateBookStatus);

// --- NOVAS ROTAS PARA GERENCIAMENTO ---

// Rota para listar TODOS os livros para o admin
router.get('/admin/all-books', AdminController.listAll);

// Rota para DELETAR um livro específico
router.delete('/admin/books/:bookId', AdminController.deleteBook);


module.exports = router;