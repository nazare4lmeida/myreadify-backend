// ARQUIVO: src/routes/reviewRoutes.js (VERSÃO HÍBRIDA)

const { Router } = require('express');
const ReviewController = require('../controllers/ReviewController');
const authMiddleware = require('../middlewares/auth');

const routes = new Router();

// --- 1. ROTAS PÚBLICAS ---
// Estas rotas são definidas ANTES do middleware de autenticação.
// Qualquer pessoa pode acessá-las.
routes.get('/books/:slug/reviews', ReviewController.index);
routes.get('/summaries/:summaryId/reviews', ReviewController.index);


// --- 2. MIDDLEWARE DE AUTENTICAÇÃO ---
// A partir desta linha, TODAS as rotas abaixo exigirão login.
routes.use(authMiddleware);


// --- 3. ROTAS PRIVADAS ---
// Estas rotas são definidas DEPOIS do middleware.
routes.post('/books/:slug/reviews', ReviewController.store);
routes.post('/summaries/reviews', ReviewController.store);
routes.get('/reviews/my', ReviewController.showMyReviews);
routes.put('/reviews/:reviewId', ReviewController.update);
routes.delete('/reviews/:reviewId', ReviewController.destroy);

module.exports = routes;