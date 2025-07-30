const { Router } = require("express");
const authMiddleware = require("../middlewares/auth");

const routes = new Router();

/**
 * @swagger
 * tags:
 *   - name: CheckAuthRoutes
 *     description: Checagem de autenticação.
 */

/**
 * @swagger
 * /check-auth:
 *   get:
 *     summary: Verifica token de autenticação.
 *     tags: [CheckAuthRoutes]
 *     responses:
 *       200:
 *         description: OK
 */
routes.get("/check-auth", authMiddleware, (req, res) => {
  return res.status(200).json({ message: "Token válido" });
});

module.exports = routes;
