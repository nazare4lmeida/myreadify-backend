const { Router } = require("express");
const authMiddleware = require("../middlewares/auth");
const SummaryController = require("../controllers/SummaryController");

/**
 * @swagger
 * tags:
 *   name: Summary
 *   description: Rotas para envio de resumos de livros
 */

const routes = new Router();

/**
 * @swagger
 * /summaries:
 *   post:
 *     summary: Envia um novo resumo de livro
 *     tags: [Summary]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - category
 *               - summary
 *             properties:
 *               title:
 *                 type: string
 *                 example: A Menina que Roubava Livros
 *               author:
 *                 type: string
 *                 example: Markus Zusak
 *               category:
 *                 type: string
 *                 example: Ficção
 *               summary:
 *                 type: string
 *                 example: Um resumo completo da obra.
 *     responses:
 *       201:
 *         description: Resumo enviado com sucesso
 */
routes.post("/summaries", authMiddleware, SummaryController.store);

module.exports = routes;
