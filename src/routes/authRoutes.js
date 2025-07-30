const { Router } = require('express');
const AuthController = require('../controllers/AuthController');
const authMiddleware = require("../middlewares/auth");

const routes = new Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Autenticação de usuários.
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra novo usuário comum.
 *     tags: [Auth]
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
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: OK
 */
routes.post('/register', AuthController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login de usuário.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 */
routes.post('/login', AuthController.login);

/**
 * @swagger
 * /auth/register/admin:
 *   post:
 *     summary: Registra novo administrador.
 *     tags: [Auth]
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
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: OK
 */
routes.post('/register/admin', AuthController.registerAdmin);

module.exports = routes;
