const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const { User } = require("../models");

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Verificação de login e dados do usuário autenticado
 */

/**
 * @swagger
 * /check-auth:
 *   get:
 *     summary: Verifica se o usuário está autenticado e retorna seus dados
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário autenticado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 loggedIn:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Maria
 *                     email:
 *                       type: string
 *                       example: maria@email.com
 *                     role:
 *                       type: string
 *                       example: user
 *       401:
 *         description: Token ausente ou inválido
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */

router.get("/check-auth", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ["id", "name", "email", "role"],
    });

    if (!user) {
      return res
        .status(404)
        .json({ loggedIn: false, error: "Usuário não encontrado." });
    }

    return res.status(200).json({ loggedIn: true, user: user });
  } catch (error) {
    return res
      .status(500)
      .json({ loggedIn: false, error: "Erro interno do servidor." });
  }
});

module.exports = router;
