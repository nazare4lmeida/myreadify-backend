const { Router } = require("express");
const ReviewController = require("../controllers/ReviewController");
const authMiddleware = require("../middlewares/auth");

const routes = new Router();

routes.get("/books/:slug/reviews", ReviewController.index);

routes.use(authMiddleware);

routes.post("/books/:slug/reviews", ReviewController.store);

routes.get("/reviews/my", ReviewController.showMyReviews);

routes.put("/reviews/:reviewId", ReviewController.update);

routes.delete("/reviews/:reviewId", ReviewController.destroy);

module.exports = routes;
