const { Router } = require("express");

const bookRoutes = require("./bookRoutes");
const reviewRoutes = require("./reviewRoutes");
const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const contactRoutes = require("./contactRoutes");
const summaryRoutes = require("./summaryRoutes");
// const checkAuthRoutes = require("./checkAuthRoutes"); // Removido: Não é mais necessário

const routes = new Router();

routes.use(bookRoutes);
routes.use(reviewRoutes); // VERIFICAR: Se esta rota usa 'authMiddleware', remova-o nela.
routes.use(authRoutes);
routes.use(adminRoutes); // VERIFICAR: Se esta rota usa 'authMiddleware', remova-o nela.
routes.use(contactRoutes);
routes.use(summaryRoutes); // VERIFICAR: Se esta rota usa 'authMiddleware', remova-o nela.
// routes.use(checkAuthRoutes); // Removido

module.exports = routes;
