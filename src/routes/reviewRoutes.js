const { Router } = require('express');
const ReviewController = require('../controllers/ReviewController');
const authMiddleware = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Avaliações de livros e resumos
 */

const routes = new Router();

routes.use(authMiddleware);

/**
 * @swagger
 * /books/{bookId}/reviews:
 *   post:
 *     summary: Cria uma avaliação para um livro
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: bookId
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
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Avaliação criada
 */
routes.post('/books/:bookId/reviews', ReviewController.store);

/**
 * @swagger
 * /summaries/reviews:
 *   post:
 *     summary: Cria uma avaliação para um resumo
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating, summary_id]
 *             properties:
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *               summary_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Avaliação criada
 */
routes.post('/summaries/reviews', ReviewController.store);

/**
 * @swagger
 * /books/{bookId}/reviews:
 *   get:
 *     summary: Lista as avaliações de um livro
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de avaliações
 */
routes.get('/books/:bookId/reviews', ReviewController.index);

/**
 * @swagger
 * /summaries/{summaryId}/reviews:
 *   get:
 *     summary: Lista as avaliações de um resumo
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: summaryId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de avaliações
 */
routes.get('/summaries/:summaryId/reviews', ReviewController.index);

/**
 * @swagger
 * /reviews/my:
 *   get:
 *     summary: Lista as avaliações feitas pelo usuário logado
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Lista de avaliações do usuário
 */
routes.get('/reviews/my', ReviewController.showMyReviews);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   put:
 *     summary: Atualiza uma avaliação
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Avaliação atualizada
 */
routes.put('/reviews/:reviewId', ReviewController.update);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   delete:
 *     summary: Remove uma avaliação
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Avaliação removida
 */
routes.delete('/reviews/:reviewId', ReviewController.destroy);

module.exports = routes;
