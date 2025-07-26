const { Router } = require("express");
const authMiddleware = require("../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Auth Check
 *   description: Rota para verificar autenticação
 */

const routes = new Router();

/**
 * @swagger
 * /check-auth:
 *   get:
 *     summary: Verifica se o token JWT é válido
 *     tags: [Auth Check]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *       401:
 *         description: Token inválido ou ausente
 */
routes.get("/check-auth", authMiddleware, (req, res) => {
  return res.status(200).json({ message: "Token válido" });
});

module.exports = routes;
