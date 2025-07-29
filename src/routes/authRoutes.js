const { Router } = require('express');
const AuthController = require('../controllers/AuthController');
const authMiddleware = require("../middlewares/auth");

const routes = new Router();

routes.post('/register', AuthController.register);

routes.post('/login', AuthController.login);

routes.post('/register/admin', AuthController.registerAdmin);

module.exports = routes;
