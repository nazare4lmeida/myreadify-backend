const { Router } = require("express");
const ReviewController = require("../controllers/ReviewController");
// const authMiddleware = require("../middlewares/auth"); // Removido

const routes = new Router();

routes.get("/books/:slug/reviews", ReviewController.index);

// routes.use(authMiddleware); // Removido

// As rotas de CRUD de reviews agora não terão proteção.
// ATENÇÃO: ISSO É APENAS PARA DEBUG. NÃO USE EM PRODUÇÃO NESTE ESTADO!
routes.post("/books/:slug/reviews", ReviewController.store);

routes.get("/reviews/my", ReviewController.showMyReviews);

routes.put("/reviews/:reviewId", ReviewController.update);

routes.delete("/reviews/:reviewId", ReviewController.destroy);

module.exports = routes;
