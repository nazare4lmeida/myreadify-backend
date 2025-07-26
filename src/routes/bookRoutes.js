const { Router } = require("express");
const BookController = require("../controllers/BookController");

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Rotas para livros mockados que ainda não possuem resumo
 */

const routes = new Router();

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Lista todos os livros mockados (sem resumo)
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Lista de livros retornada com sucesso
 */
routes.get("/books", BookController.index);

/**
 * @swagger
 * /books/{bookId}:
 *   get:
 *     summary: Obtém detalhes de um livro específico (sem resumo)
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         description: ID do livro mockado
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do livro retornados com sucesso
 *       404:
 *         description: Livro não encontrado
 */
routes.get("/books/:bookId", BookController.show);

module.exports = routes;
