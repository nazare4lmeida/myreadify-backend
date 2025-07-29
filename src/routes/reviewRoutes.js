const { Router } = require("express");
const ReviewController = require("../controllers/ReviewController");
const authMiddleware = require("../middlewares/auth"); // Reabilitado

const routes = new Router();

// Rota pública para listar avaliações de um livro
routes.get("/books/:slug/reviews", ReviewController.index);

// Todas as rotas abaixo exigem autenticação
// ATENÇÃO: Descomente esta linha para reativar a proteção em PROD!
routes.use(authMiddleware); 

// Rotas de CRUD de reviews
routes.post("/books/:slug/reviews", ReviewController.store);
routes.get("/reviews/my", ReviewController.showMyReviews); // Esta é a rota que o frontend deve chamar
routes.put("/reviews/:reviewId", ReviewController.update);
routes.delete("/reviews/:reviewId", ReviewController.destroy);

module.exports = routes;
