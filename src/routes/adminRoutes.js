const { Router } = require("express");
const multer = require("multer");
const multerConfig = require("../config/multer");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin");

const AdminController = require("../controllers/AdminController");
const MessageController = require("../controllers/MessageController");

const router = new Router();
const upload = multer(multerConfig);

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Rotas administrativas protegidas
 */

router.use("/admin", authMiddleware, adminMiddleware);

/**
 * @swagger
 * /admin/pending-books:
 *   get:
 *     summary: Lista todos os livros pendentes
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Lista de livros pendentes retornada com sucesso
 */
router.get("/admin/pending-books", AdminController.listPending);

/**
 * @swagger
 * /admin/books/{bookId}/status:
 *   patch:
 *     summary: Atualiza o status de um livro
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         description: ID do livro
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Novo status do livro
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: COMPLETED
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 */
router.patch("/admin/books/:bookId/status", AdminController.updateBookStatus);

/**
 * @swagger
 * /admin/books/{bookId}/cover:
 *   patch:
 *     summary: Atualiza apenas a imagem da capa de um livro
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         description: ID do livro para atualizar a capa
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: O novo arquivo de imagem da capa.
 *     responses:
 *       200:
 *         description: Capa atualizada com sucesso
 */
router.patch(
  "/admin/books/:bookId/cover",
  upload.single("coverImage"),
  AdminController.updateCoverImage
);

/**
 * @swagger
 * /admin/all-books:
 *   get:
 *     summary: Lista todos os livros aprovados
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Lista de livros retornada com sucesso
 */
router.get("/admin/all-books", AdminController.listAll);
router.get("/admin/all-summaries", AdminController.listAllSummaries);

/**
 * @swagger
 * /admin/books/{bookId}:
 *   delete:
 *     summary: Remove um livro do sistema
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Livro removido com sucesso
 */
router.delete("/admin/books/:bookId", AdminController.deleteBook);

/**
 * @swagger
 * /admin/pending-summaries:
 *   get:
 *     summary: Lista todos os resumos pendentes
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Lista de resumos pendentes retornada com sucesso
 */
router.get("/admin/pending-summaries", AdminController.listPendingSummaries);

/**
 * @swagger
 * /admin/summaries/{summaryId}/status:
 *   patch:
 *     summary: Atualiza o status de um resumo
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: summaryId
 *         required: true
 *         description: ID do resumo
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Novo status do resumo
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: COMPLETED
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 */
router.patch(
  "/admin/summaries/:summaryId/status",
  AdminController.updateSummaryStatus
);

/**
 * @swagger
 * /admin/summaries/{summaryId}:
 *   delete:
 *     summary: Remove um resumo do sistema
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: summaryId
 *         required: true
 *         description: ID do resumo
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resumo removido com sucesso
 */
router.delete("/admin/summaries/:summaryId", AdminController.deleteSummary);

/**
 * @swagger
 * /admin/messages:
 *   get:
 *     summary: Lista todas as mensagens recebidas
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Lista de mensagens retornada com sucesso
 */
router.get("/admin/messages", MessageController.index);

/**
 * @swagger
 * /admin/messages/{messageId}:
 *   delete:
 *     summary: Exclui uma mensagem
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mensagem excluída com sucesso
 */
router.delete("/admin/messages/:messageId", MessageController.destroy);

/**
 * @swagger
 * /admin/messages/{messageId}/reply:
 *   post:
 *     summary: Responde a uma mensagem
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Conteúdo da resposta
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reply:
 *                 type: string
 *                 example: Obrigado pelo contato!
 *     responses:
 *       200:
 *         description: Resposta enviada com sucesso
 */
router.post("/admin/messages/:messageId/reply", MessageController.reply);

module.exports = router;
