// src/controllers/BookController.js (VERSÃO FINAL COMPLETA E CORRIGIDA)

const { Book } = require("../models");

class BookController {
  async index(req, res) {
    try {
      const books = await Book.findAll({
        // <<< CORREÇÃO PRINCIPAL: Filtra para mostrar apenas livros APROVADOS >>>
        where: { status: "COMPLETED" },
        order: [["title", "ASC"]],
        attributes: ["id", "title", "author", "category", "slug", "cover_url"],
      });

      const formattedBooks = books.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        category: book.category,
        slug: book.slug,
        cover_url: book.full_cover_url,
      }));

      return res.json(formattedBooks);

    } catch (error) {
      console.error("🔥 ERRO AO BUSCAR LIVROS:", error);
      return res.status(500).json({ error: "Erro ao buscar livros." });
    }
  }

  // A função show pode permanecer como está.
  async show(req, res) {
    // Lógica para buscar um livro por slug pode ser implementada aqui no futuro
    const { slug } = req.params;
    res.status(500).json({ message: `A rota para ${slug} ainda não foi implementada.` });
  }
}

module.exports = new BookController();