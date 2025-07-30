const { Router } = require("express");

const bookRoutes = require("./bookRoutes");
const reviewRoutes = require("./reviewRoutes");
const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const contactRoutes = require("./contactRoutes");
const summaryRoutes = require("./summaryRoutes");

const routes = new Router();

routes.get('/', (req, res) => {
  res.json({ message: "Bem-vindo(a) à API MyReadify!" });
});


routes.use(authRoutes);
routes.use(contactRoutes);

routes.use(bookRoutes);
routes.use(reviewRoutes);
routes.use("/admin", adminRoutes);
routes.use(summaryRoutes);

module.exports = routes;