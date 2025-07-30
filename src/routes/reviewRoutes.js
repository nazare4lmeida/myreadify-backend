const { Router } = require("express");
const ReviewController = require("../controllers/ReviewController");
const authMiddleware = require("../middlewares/auth");

const routes = new Router();

/**
 * @swagger
 * tags:
 *   - name: Reviews
 *     description: Avaliações e resenhas.
 */

/**
 * @swagger
 * /books/{slug}/reviews:
 *   get:
 *     summary: Lista avaliações de um livro.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
routes.get("/books/:slug/reviews", ReviewController.index);

routes.use(authMiddleware);

/**
 * @swagger
 * /books/{slug}/reviews:
 *   post:
 *     summary: Cria nova avaliação.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: OK
 */
routes.post("/books/:slug/reviews", ReviewController.store);

/**
 * @swagger
 * /reviews/my:
 *   get:
 *     summary: Lista minhas avaliações.
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: OK
 */
routes.get("/reviews/my", ReviewController.showMyReviews);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   put:
 *     summary: Atualiza avaliação.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 */
routes.put("/reviews/:reviewId", ReviewController.update);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   delete:
 *     summary: Deleta avaliação.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 */
routes.delete("/reviews/:reviewId", ReviewController.destroy);

module.exports = routes;
