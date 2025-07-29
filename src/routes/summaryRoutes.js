const { Router } = require("express");
const authMiddleware = require("../middlewares/auth"); // Reabilitado
const SummaryController = require("../controllers/SummaryController");
const multer = require('multer'); 
const multerConfig = require('../config/multer'); 
const routes = new Router();
const upload = multer(multerConfig); 

// A rota de criação de resumo permite upload de arquivo
// ATENÇÃO: Descomente esta linha para reativar a proteção em PROD!
routes.post("/summaries", authMiddleware, upload.single('coverImage'), SummaryController.store);

// Rota para o usuário logado buscar seus próprios resumos
// ATENÇÃO: Descomente esta linha para reativar a proteção em PROD!
routes.get("/my-summaries", authMiddleware, SummaryController.getMySummaries);

module.exports = routes;
