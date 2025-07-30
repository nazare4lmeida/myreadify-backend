const { Router } = require("express");
const authMiddleware = require("../middlewares/auth");
const SummaryController = require("../controllers/SummaryController");
const multer = require('multer');
const multerConfig = require('../config/multer');

const routes = new Router();
const upload = multer(multerConfig);

/**
 * @swagger
 * tags:
 *   - name: Summaries
 *     description: Resumos de livros.
 */

/**
 * @swagger
 * /summaries:
 *   post:
 *     summary: Envia novo resumo.
 *     tags: [Summaries]
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
 *               author:
 *                 type: string
 *               content:
 *                 type: string
 *               coverImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: OK
 */
routes.post("/summaries", authMiddleware, upload.single('coverImage'), SummaryController.store);

/**
 * @swagger
 * /my-summaries:
 *   get:
 *     summary: Lista meus resumos.
 *     tags: [Summaries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
routes.get("/my-summaries", authMiddleware, SummaryController.getMySummaries);

module.exports = routes;
