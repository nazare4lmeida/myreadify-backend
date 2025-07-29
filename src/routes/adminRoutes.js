const { Router } = require("express");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin");
const AdminController = require("../controllers/AdminController");
const MessageController = require("../controllers/MessageController");
const multer = require('multer'); // Importar multer
const multerConfig = require('../config/multer'); // Importar a configuração do multer

const router = new Router();
const upload = multer(multerConfig); // Instanciar o multer

// Aplica authMiddleware e adminMiddleware a TODAS as rotas DEFINIDAS ABAIXO NESTE ARQUIVO.
// Isso garante que apenas administradores autenticados possam acessar essas rotas.
router.use(authMiddleware);
router.use(adminMiddleware);

// Rotas de administração (sem o prefixo "/admin" aqui, pois será adicionado no routes/index.js)
router.get("/pending-summaries", AdminController.listPendingSummaries);
router.post("/summaries/:summaryId/approve", AdminController.approveSummary);
router.delete("/summaries/:summaryId", AdminController.rejectSummary);
router.patch("/books/:bookId/cover", upload.single('coverImage'), AdminController.updateBookCover); // Rota para upload de capa

router.get("/all-summaries", AdminController.listAllSummaries);

router.get("/messages", MessageController.index);
router.delete("/messages/:messageId", MessageController.destroy);

module.exports = router;
