const { Router } = require("express");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin");
const AdminController = require("../controllers/AdminController");
const MessageController = require("../controllers/MessageController");
const multer = require('multer');
const multerConfig = require('../config/multer');

const router = new Router();
const upload = multer(multerConfig);

router.use(authMiddleware);
router.use(adminMiddleware);

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Endpoints administrativos.
 */

/**
 * @swagger
 * /admin/pending-summaries:
 *   get:
 *     summary: Lista resumos pendentes.
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/pending-summaries", AdminController.listPendingSummaries);

/**
 * @swagger
 * /admin/summaries/{summaryId}/approve:
 *   post:
 *     summary: Aprova um resumo.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: summaryId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 */
router.post("/summaries/:summaryId/approve", AdminController.approveSummary);

/**
 * @swagger
 * /admin/summaries/{summaryId}:
 *   delete:
 *     summary: Rejeita/deleta resumo.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: summaryId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 */
router.delete("/summaries/:summaryId", AdminController.rejectSummary);

/**
 * @swagger
 * /admin/books/{bookId}/cover:
 *   patch:
 *     summary: Atualiza capa de livro.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
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
 *     responses:
 *       200:
 *         description: OK
 */
router.patch("/books/:bookId/cover", upload.single('coverImage'), AdminController.updateBookCover);

/**
 * @swagger
 * /admin/all-summaries:
 *   get:
 *     summary: Lista todos os resumos.
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/all-summaries", AdminController.listAllSummaries);

/**
 * @swagger
 * /admin/messages:
 *   get:
 *     summary: Lista mensagens de contato.
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/messages", MessageController.index);

/**
 * @swagger
 * /admin/messages/{messageId}:
 *   delete:
 *     summary: Deleta mensagem de contato.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 */
router.delete("/messages/:messageId", MessageController.destroy);

module.exports = router;
