// src/routes/authRoutes.js
const { Router } = require('express');
const AuthController = require('../controllers/AuthController');

const routes = new Router();

routes.post('/users', AuthController.register);
routes.post('/login', AuthController.authenticate);

module.exports = routes;