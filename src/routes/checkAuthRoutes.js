const { Router } = require("express");
const authMiddleware = require("../middlewares/auth");

const routes = new Router();

routes.get("/check-auth", authMiddleware, (req, res) => {
  return res.status(200).json({ message: "Token válido" });
});

module.exports = routes;
