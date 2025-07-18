// src/routes/reviewRoutes.js

const { Router } = require('express');
const ReviewController = require('../controllers/ReviewController');
const authMiddleware = require('../middlewares/auth');

const routes = new Router();

// --- Rotas Aninhadas em Livros ---
// Rota para listar todas as avaliações de um livro (pública)
routes.get('/books/:bookId/reviews', ReviewController.index);

// Rota para criar uma nova avaliação para um livro (protegida)
routes.post('/books/:bookId/reviews', authMiddleware, ReviewController.store);


// --- Rotas Específicas de Avaliações ---
// Rota para o usuário ver suas próprias avaliações.
// É importante que esta rota venha ANTES de '/reviews/:reviewId' para não haver conflito.
routes.get('/reviews/my-reviews', authMiddleware, ReviewController.showMyReviews);


// --- NOVAS ROTAS ADICIONADAS ---
// Rota para ATUALIZAR uma avaliação específica (protegida)
// O :reviewId é um parâmetro que identifica qual avaliação será editada.
routes.put('/reviews/:reviewId', authMiddleware, ReviewController.update);

// Rota para DELETAR uma avaliação específica (protegida)
// O :reviewId é um parâmetro que identifica qual avaliação será deletada.
routes.delete('/reviews/:reviewId', authMiddleware, ReviewController.destroy);


module.exports = routes;