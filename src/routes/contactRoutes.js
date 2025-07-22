// src/routes/contactRoutes.js
const { Router } = require('express');
const ContactController = require('../controllers/ContactController');

const routes = new Router();

// Esta rota é pública, não precisa de autenticação para enviar mensagem.
routes.post('/contact', ContactController.store);

module.exports = routes;