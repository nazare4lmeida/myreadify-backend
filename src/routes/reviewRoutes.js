const { Router } = require('express');
const ReviewController = require('../controllers/ReviewController');
const authMiddleware = require('../middlewares/auth');

const routes = new Router();

// --- 1. ROTAS PÚBLICAS (definidas ANTES do middleware) ---
routes.get('/books/:slug/reviews', ReviewController.index);
routes.get('/summaries/:summaryId/reviews', ReviewController.index); // Mantemos esta por consistência

// --- 2. MIDDLEWARE DE AUTENTICAÇÃO ---
// A partir desta linha, todas as rotas abaixo exigirão login
routes.use(authMiddleware);

// --- 3. ROTAS PRIVADAS (definidas DEPOIS do middleware) ---
routes.post('/books/:slug/reviews', ReviewController.store); // << USA SLUG
routes.post('/summaries/reviews', ReviewController.store);
routes.get('/reviews/my', ReviewController.showMyReviews);
routes.put('/reviews/:reviewId', ReviewController.update);
routes.delete('/reviews/:reviewId', ReviewController.destroy);

module.exports = routes;