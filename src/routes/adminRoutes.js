const { Router } = require("express");
// const authMiddleware = require("../middlewares/auth"); // Removido
// const adminMiddleware = require("../middlewares/admin"); // Removido

const AdminController = require("../controllers/AdminController");
const MessageController = require("../controllers/MessageController");

const router = new Router();

// As rotas de admin agora não terão proteção de token nem verificação de admin.
// ATENÇÃO: ISSO É APENAS PARA DEBUG. NÃO USE EM PRODUÇÃO NESTE ESTADO!
// router.use("/admin", authMiddleware, adminMiddleware); // Removido

router.get("/admin/pending-summaries", AdminController.listPendingSummaries);
router.post("/admin/summaries/:summaryId/approve", AdminController.approveSummary);
router.delete("/admin/summaries/:summaryId", AdminController.rejectSummary);

router.get("/admin/all-summaries", AdminController.listAllSummaries);

router.get("/admin/messages", MessageController.index);
router.delete("/admin/messages/:messageId", MessageController.destroy);

module.exports = router;
