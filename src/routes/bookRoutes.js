// src/routes/bookRoutes.js

const { Router } = require('express');
const multer = require('multer');
const multerConfig = require('../config/multer');

const BookController = require('../controllers/BookController');
const authMiddleware = require('../middlewares/auth');

const routes = new Router();
const upload = multer(multerConfig);

// --- Rotas Públicas ---
routes.get('/books', BookController.index);
routes.get('/books/:slug', BookController.show);

// --- Rotas de Usuário Autenticado ---
routes.post('/books', authMiddleware, upload.single('coverImage'), BookController.store);
routes.get('/my-books', authMiddleware, BookController.listMyBooks);

module.exports = routes;