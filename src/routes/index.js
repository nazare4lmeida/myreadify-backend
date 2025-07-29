const { Router } = require("express");

const bookRoutes = require("./bookRoutes");
const reviewRoutes = require("./reviewRoutes");
const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const contactRoutes = require("./contactRoutes");
const summaryRoutes = require("./summaryRoutes");
const checkAuthRoutes = require("./checkAuthRoutes");

const routes = new Router();

routes.use(bookRoutes);
routes.use(reviewRoutes);
routes.use(authRoutes);
routes.use(adminRoutes);
routes.use(contactRoutes);
routes.use(summaryRoutes);
routes.use(checkAuthRoutes);

module.exports = routes;
