const { Router } = require("express");
const multer = require("multer");
const multerConfig = require("../config/multer");

const BookController = require("../controllers/BookController");
const authMiddleware = require("../middlewares/auth");

const routes = new Router();
const upload = multer(multerConfig);

/**
 * @swagger
 * tags:
 *   name: Livros
 *   description: Gerenciamento de livros
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Lista todos os livros aprovados (público)
 *     tags: [Livros]
 *     responses:
 *       200:
 *         description: Lista de livros retornada com sucesso
 */
routes.get("/books", BookController.index);

/**
 * @swagger
 * /books/{slug}:
 *   get:
 *     summary: Detalhes de um livro específico pelo slug (público)
 *     tags: [Livros]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         description: Slug do livro
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do livro retornados com sucesso
 */
routes.get("/books/:slug", BookController.show);

routes.use(authMiddleware);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Cria um novo livro (privado)
 *     tags: [Livros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: A Menina que Roubava Livros
 *               author:
 *                 type: string
 *                 example: Markus Zusak
 *               coverImage:
 *                 type: string
 *                 format: binary
 *               description:
 *                 type: string
 *                 example: Um livro emocionante sobre a Segunda Guerra Mundial.
 *     responses:
 *       201:
 *         description: Livro criado com sucesso
 */
routes.post("/books", upload.single("coverImage"), BookController.store);

/**
 * @swagger
 * /books/{slug}:
 *   put:
 *     summary: Atualiza um livro existente (apenas texto, sem imagem)
 *     tags: [Livros]
 *     security:
 *       - bearerAuth: []
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
 *               summary:
 *                 type: string
 *                 example: Um resumo novo para o livro.
 *     responses:
 *       200:
 *         description: Livro atualizado com sucesso
 */
routes.put("/books/:slug", BookController.update);

/**
 * @swagger
 * /my-books:
 *   get:
 *     summary: Lista os livros enviados pelo usuário autenticado
 *     tags: [Livros]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista dos livros do usuário retornada com sucesso
 */
routes.get("/my-books", BookController.listMyBooks);

module.exports = routes;
