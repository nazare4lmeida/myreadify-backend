const { Router } = require('express');
const ContactController = require('../controllers/ContactController');

const routes = new Router();

/**
 * @swagger
 * tags:
 *   name: Contato
 *   description: Envio de mensagens via formulário de contato
 */

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Envia uma mensagem pelo formulário de contato
 *     tags: [Contato]
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
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               message:
 *                 type: string
 *                 example: Gostaria de saber mais sobre o projeto.
 *     responses:
 *       201:
 *         description: Mensagem enviada com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno no servidor
 */

// Esta rota é pública, não precisa de autenticação para enviar mensagem.
routes.post('/contact', ContactController.store);

module.exports = routes;
