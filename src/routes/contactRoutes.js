const { Router } = require("express");
const ContactController = require("../controllers/ContactController");

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Rotas para envio de mensagens de contato
 */

const routes = new Router();

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Envia uma nova mensagem de contato
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: Maria Oliveira
 *               email:
 *                 type: string
 *                 example: maria@email.com
 *               message:
 *                 type: string
 *                 example: Estou com um problema ao acessar o sistema.
 *     responses:
 *       200:
 *         description: Mensagem enviada com sucesso
 */
routes.post("/contact", ContactController.store);

module.exports = routes;
