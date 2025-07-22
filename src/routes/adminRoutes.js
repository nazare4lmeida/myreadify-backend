// src/routes/adminRoutes.js

const { Router } = require('express');
const authMiddleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');

// Importe os controllers necessários
const AdminController = require('../controllers/AdminController');
const MessageController = require('../controllers/MessageController'); 

const router = new Router();

// Aplica os middlewares de autenticação e de admin para TODAS as rotas neste arquivo
router.use('/admin', authMiddleware, adminMiddleware);

// --- ROTAS DE LIVROS ---
router.get('/admin/pending-books', AdminController.listPending);
router.patch('/admin/books/:bookId/status', AdminController.updateBookStatus);
router.get('/admin/all-books', AdminController.listAll);
router.delete('/admin/books/:bookId', AdminController.deleteBook);

// --- NOVA ROTA DE MENSAGENS ---
// Adicionamos a rota para buscar as mensagens, seguindo o mesmo padrão
router.get('/admin/messages', MessageController.index);
router.delete('/admin/messages/:messageId', MessageController.destroy);
router.post('/admin/messages/:messageId/reply', MessageController.reply);

module.exports = router;