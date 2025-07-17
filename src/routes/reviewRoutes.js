// src/routes/reviewRoutes.js
const { Router } = require('express');
const ReviewController = require('../controllers/ReviewController');
const authMiddleware = require('../middlewares/auth');

const routes = new Router();

// O URL para avaliações é "aninhado" dentro dos livros, o que é uma boa prática RESTful.
// Ex: /api/books/1/reviews -> Avaliações do livro com ID 1

// Rota para listar todas as avaliações de um livro (pública)
routes.get('/books/:bookId/reviews', ReviewController.index);

// Rota para criar uma nova avaliação para um livro (protegida)
routes.post('/books/:bookId/reviews', authMiddleware, ReviewController.store);

module.exports = routes;