// src/routes/bookRoutes.js (VERSÃO FINAL COMPLETA E CORRIGIDA)

const { Router } = require("express");
const BookController = require("../controllers/BookController");

const routes = new Router();

// Rota para listar todos os livros aprovados (para a CategoriesPage)
routes.get("/books", BookController.index);

// <<< CORREÇÃO: A rota agora busca pelo slug >>>
// Esta rota alimentará a sua BookDetailPage
routes.get("/books/:slug", BookController.show);

module.exports = routes;