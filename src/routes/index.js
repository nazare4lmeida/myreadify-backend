const { Router } = require("express");

const bookRoutes = require("./bookRoutes");
const reviewRoutes = require("./reviewRoutes");
const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const contactRoutes = require("./contactRoutes");
const summaryRoutes = require("./summaryRoutes");

const routes = new Router();

// As rotas de autenticação (login/registro) NUNCA devem ser protegidas por authMiddleware
// Elas devem vir primeiro ou não ter middlewares aplicados a elas globalmente aqui.
routes.use(authRoutes);

// As rotas abaixo agora dependem do authMiddleware que já foi reabilitado dentro de seus próprios arquivos
// (e.g., reviewRoutes.js, adminRoutes.js, summaryRoutes.js)
// Não coloque 'routes.use(authMiddleware);' aqui globalmente, pois afetaria o login.
routes.use(bookRoutes);
routes.use(reviewRoutes);
routes.use(adminRoutes);
routes.use(contactRoutes);
routes.use(summaryRoutes);

module.exports = routes;
