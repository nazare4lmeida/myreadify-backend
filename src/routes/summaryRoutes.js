const { Router } = require("express");
const authMiddleware = require("../middlewares/auth"); 
const SummaryController = require("../controllers/SummaryController");
const multer = require('multer'); 
const multerConfig = require('../config/multer'); 
const routes = new Router();
const upload = multer(multerConfig); 

// ATENÇÃO: PARA USO EM PRODUÇÃO, CERTIFIQUE-SE DE QUE O adminMiddleware
// ou uma verificação de role adequada seja aplicada para rotas sensíveis.

// Rota para criar um novo resumo (precisa de autenticação para 'req.userId')
// Aplica SOMENTE authMiddleware, pois qualquer usuário logado pode enviar um resumo.
routes.post("/summaries", authMiddleware, upload.single('coverImage'), SummaryController.store);

// Rota para o usuário logado buscar seus próprios resumos (precisa de autenticação)
// Aplica SOMENTE authMiddleware para garantir que req.userId esteja disponível.
routes.get("/my-summaries", authMiddleware, SummaryController.getMySummaries);

module.exports = routes;
