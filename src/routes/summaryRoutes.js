// src/routes/summaryRoutes.js (Versão Completa e Corrigida)

const { Router } = require("express");
const authMiddleware = require("../middlewares/auth");
const SummaryController = require("../controllers/SummaryController");

const routes = new Router();

// Rota existente para enviar um resumo
routes.post("/summaries", authMiddleware, SummaryController.store);

// >>> INÍCIO DA NOVA ROTA <<<
// Rota para o usuário logado buscar seus próprios resumos
routes.get("/my-summaries", authMiddleware, SummaryController.getMySummaries);
// >>> FIM DA NOVA ROTA <<<

module.exports = routes;