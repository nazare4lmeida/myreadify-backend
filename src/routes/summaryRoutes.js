const { Router } = require("express");
// const authMiddleware = require("../middlewares/auth"); // Removido
const SummaryController = require("../controllers/SummaryController");
const multer = require('multer'); 
const multerConfig = require('../config/multer'); 
const routes = new Router();
const upload = multer(multerConfig); 

// As rotas de summaries agora não terão proteção.
// ATENÇÃO: ISSO É APENAS PARA DEBUG. NÃO USE EM PRODUÇÃO NESTE ESTADO!
routes.post("/summaries", upload.single('coverImage'), SummaryController.store);

// Rota para o usuário logado buscar seus próprios resumos (sem autenticação explícita aqui)
routes.get("/my-summaries", SummaryController.getMySummaries);

module.exports = routes;
