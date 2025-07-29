const { Router } = require("express");
const BookController = require("../controllers/BookController");

const routes = new Router();

// Rota para listar todos os livros aprovados (para a CategoriesPage)
routes.get("/books", BookController.index);

// Esta rota alimentará a sua BookDetailPage
routes.get("/books/:slug", BookController.show);

module.exports = routes;
