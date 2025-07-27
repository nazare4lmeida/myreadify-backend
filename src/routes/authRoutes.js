const { Router } = require('express');
const AuthController = require('../controllers/AuthController');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticação de usuários
 */

const routes = new Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registra um novo usuário (com permissão 'user')
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Maria Oliveira
 *               email:
 *                 type: string
 *                 example: maria@email.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Erro de validação ou usuário já existe
 */
routes.post('/register', AuthController.register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza login de um usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: maria@email.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login bem-sucedido com token JWT
 *       401:
 *         description: Credenciais inválidas
 */
routes.post('/login', AuthController.login);


// >>> INÍCIO DA ALTERAÇÃO <<<

/**
 * @swagger
 * /register/admin:
 *   post:
 *     summary: Registra um novo usuário administrador (rota de desenvolvimento)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Admin User
 *               email:
 *                 type: string
 *                 example: admin@myreadify.com
 *               password:
 *                 type: string
 *                 example: senhasecreta123
 *     responses:
 *       201:
 *         description: Administrador registrado com sucesso
 *       400:
 *         description: E-mail já existe
 */
routes.post('/register/admin', AuthController.registerAdmin);
// >>> FIM DA ALTERAÇÃO <<<


module.exports = routes;