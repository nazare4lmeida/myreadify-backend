const { Router } = require("express");
const authMiddleware = require("../middlewares/auth");
const SummaryController = require("../controllers/SummaryController");
const multer = require('multer'); 
const multerConfig = require('../config/multer'); 
const routes = new Router();
const upload = multer(multerConfig); 

routes.post("/summaries", authMiddleware, upload.single('coverImage'), SummaryController.store);

// Rota para o usuário logado buscar seus próprios resumos
routes.get("/my-summaries", authMiddleware, SummaryController.getMySummaries);

module.exports = routes;