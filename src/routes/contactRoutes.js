const { Router } = require("express");
const ContactController = require("../controllers/ContactController");

const routes = new Router();

/**
 * @swagger
 * tags:
 *   - name: Contact
 *     description: Mensagens de contato.
 */

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Envia nova mensagem de contato.
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: OK
 */
routes.post("/contact", ContactController.store);

module.exports = routes;
