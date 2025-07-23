const { Router } = require('express');
const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const bookRoutes = require('./bookRoutes');
const checkAuthRoutes = require('./checkAuthRoutes');
const contactRoutes = require('./contactRoutes');
const reviewRoutes = require('./reviewRoutes');

const routes = new Router();

routes.use(authRoutes);
routes.use(adminRoutes);
routes.use(bookRoutes);
routes.use(checkAuthRoutes);
routes.use(contactRoutes);
routes.use(reviewRoutes);

module.exports = routes;
