// src/routes/summaryRoutes.js (Versão Final e Corrigida)

const { Router } = require("express");
const authMiddleware = require("../middlewares/auth");
const SummaryController = require("../controllers/SummaryController");
const multer = require('multer'); // <<< CORREÇÃO 1: Importar o multer
const multerConfig = require('../config/multer'); // <<< CORREÇÃO 2: Importar a configuração do multer

const routes = new Router();
const upload = multer(multerConfig); // <<< CORREÇÃO 3: Criar a instância de upload

// Rota existente para enviar um resumo
// >>> CORREÇÃO 4: Adicionar o middleware do multer na rota <<<
// 'coverImage' deve ser o nome exato do campo do arquivo no seu FormData do frontend
routes.post("/summaries", authMiddleware, upload.single('coverImage'), SummaryController.store);

// Rota para o usuário logado buscar seus próprios resumos
routes.get("/my-summaries", authMiddleware, SummaryController.getMySummaries);

module.exports = routes;