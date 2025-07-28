// src/routes/adminRoutes.js (VERSÃO FINAL COMPLETA E CORRIGIDA)

const { Router } = require("express");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin");

const AdminController = require("../controllers/AdminController");
const MessageController = require("../controllers/MessageController");

const router = new Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Rotas administrativas para gestão de conteúdo
 */

router.use("/admin", authMiddleware, adminMiddleware);

// =======================================================
// ROTAS PARA GESTÃO DE RESUMOS
// =======================================================

router.get("/admin/pending-summaries", AdminController.listPendingSummaries);
router.post("/admin/summaries/:summaryId/approve", AdminController.approveSummary);
router.delete("/admin/summaries/:summaryId", AdminController.rejectSummary);

// <<< CORREÇÃO PRINCIPAL: ADICIONANDO A ROTA QUE FALTAVA >>>
/**
 * @swagger
 * /admin/all-summaries:
 *   get:
 *     summary: Lista TODOS os resumos do sistema (para gestão)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Lista de todos os resumos retornada com sucesso
 */
router.get("/admin/all-summaries", AdminController.listAllSummaries);


// =======================================================
// ROTAS PARA GESTÃO DE MENSAGENS
// =======================================================

router.get("/admin/messages", MessageController.index);
router.delete("/admin/messages/:messageId", MessageController.destroy);


module.exports = router;