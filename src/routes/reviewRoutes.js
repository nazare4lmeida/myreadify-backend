const { Router } = require("express");
const ReviewController = require("../controllers/ReviewController");
const authMiddleware = require("../middlewares/auth");

const routes = new Router();

// --- Rotas públicas ---
// Lista as avaliações de um livro pelo slug
routes.get("/books/:slug/reviews", ReviewController.index);

// --- Middleware de autenticação ---
routes.use(authMiddleware);

// --- Rotas privadas ---
// Criar uma avaliação para um livro (usando slug)
routes.post("/books/:slug/reviews", ReviewController.store);

// Listar as minhas avaliações
routes.get("/reviews/my", ReviewController.showMyReviews);

// Atualizar uma avaliação
routes.put("/reviews/:reviewId", ReviewController.update);

// Deletar uma avaliação
routes.delete("/reviews/:reviewId", ReviewController.destroy);

module.exports = routes;
