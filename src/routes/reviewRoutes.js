const { Router } = require('express');
const ReviewController = require('../controllers/ReviewController');
const authMiddleware = require('../middlewares/auth');

const routes = new Router();

/**
 * @swagger
 * tags:
 *   name: Avaliações
 *   description: Gerenciamento de avaliações de livros
 */

/**
 * @swagger
 * /books/{bookId}/reviews:
 *   get:
 *     summary: Lista todas as avaliações de um livro
 *     tags: [Avaliações]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do livro
 *     responses:
 *       200:
 *         description: Lista de avaliações
 *       404:
 *         description: Livro não encontrado
 */
routes.get('/books/:bookId/reviews', ReviewController.index);

/**
 * @swagger
 * /books/{bookId}/reviews:
 *   post:
 *     summary: Cria uma nova avaliação para um livro
 *     tags: [Avaliações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do livro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: integer
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Excelente leitura, recomendo!
 *     responses:
 *       201:
 *         description: Avaliação criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
routes.post('/books/:bookId/reviews', authMiddleware, ReviewController.store);

/**
 * @swagger
 * /reviews/my-reviews:
 *   get:
 *     summary: Lista as avaliações feitas pelo usuário autenticado
 *     tags: [Avaliações]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de avaliações do usuário
 *       401:
 *         description: Não autorizado
 */
routes.get('/reviews/my-reviews', authMiddleware, ReviewController.showMyReviews);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   put:
 *     summary: Atualiza uma avaliação específica
 *     tags: [Avaliações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da avaliação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: Atualizei minha opinião sobre o livro.
 *     responses:
 *       200:
 *         description: Avaliação atualizada
 *       404:
 *         description: Avaliação não encontrada
 */
routes.put('/reviews/:reviewId', authMiddleware, ReviewController.update);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   delete:
 *     summary: Remove uma avaliação específica
 *     tags: [Avaliações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da avaliação
 *     responses:
 *       204:
 *         description: Avaliação deletada com sucesso
 *       404:
 *         description: Avaliação não encontrada
 */
routes.delete('/reviews/:reviewId', authMiddleware, ReviewController.destroy);

module.exports = routes;
