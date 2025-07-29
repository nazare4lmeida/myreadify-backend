const { Router } = require("express");
const authMiddleware = require("../middlewares/auth"); // Reabilitado
const adminMiddleware = require("../middlewares/admin"); // Reabilitado

const AdminController = require("../controllers/AdminController");
const MessageController = require("../controllers/MessageController");

const multer = require('multer'); // Para uploads
const multerConfig = require('../config/multer'); // Configuração do multer
const upload = multer(multerConfig); 

const router = new Router();

// Aplica os middlewares de autenticação e admin para todas as rotas abaixo
// ATENÇÃO: Descomente esta linha para reativar a proteção em PROD!
router.use(authMiddleware, adminMiddleware); 

// Rotas de gestão de resumos (acesso admin)
router.get("/admin/pending-summaries", AdminController.listPendingSummaries);
router.post("/admin/summaries/:summaryId/approve", AdminController.approveSummary);
router.delete("/admin/summaries/:summaryId", AdminController.rejectSummary);
router.get("/admin/all-summaries", AdminController.listAllSummaries);

// Rotas de gestão de mensagens (acesso admin)
router.get("/admin/messages", MessageController.index);
router.delete("/admin/messages/:messageId", MessageController.destroy);
router.post("/admin/messages/:messageId/reply", MessageController.reply); // Rota para responder mensagens

// CORREÇÃO: Adicionada rota para atualizar capa de livro via admin
router.patch("/admin/books/:bookId/cover", upload.single('coverImage'), AdminController.updateBookCover);


module.exports = router;
