const { Router } = require("express");
const ContactController = require("../controllers/ContactController");

const routes = new Router();

routes.post("/contact", ContactController.store);

module.exports = routes;
