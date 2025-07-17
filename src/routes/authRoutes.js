// src/routes/authRoutes.js
const { Router } = require('express');
const AuthController = require('../controllers/AuthController');

const routes = new Router();

routes.post('/register', AuthController.register);
routes.post('/login', AuthController.authenticate);

module.exports = routes;