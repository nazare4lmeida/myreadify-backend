const { Router } = require("express");
const BookController = require("../controllers/BookController");

const routes = new Router();

/**
 * @swagger
 * tags:
 *   - name: Books
 *     description: Livros e seus detalhes.
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Lista todos os livros aprovados.
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: OK
 */
routes.get("/books", BookController.index);

/**
 * @swagger
 * /books/{slug}:
 *   get:
 *     summary: Detalhes de um livro por slug.
 *     tags: [Books]
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
routes.get("/books/:slug", BookController.show);

module.exports = routes;
