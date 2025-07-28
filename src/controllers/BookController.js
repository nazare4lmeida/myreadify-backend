// src/controllers/BookController.js (VERSÃO FINAL COMPLETA E CORRIGIDA)

// <<< CORREÇÃO 1: Importar o modelo 'User' para podermos usá-lo >>>
const { Book, Summary, User } = require("../models");

class BookController {
  // A função index para a CategoriesPage já está correta.
  async index(req, res) {
    try {
      const books = await Book.findAll({
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

  // A correção principal está na função 'show'
  async show(req, res) {
    try {
      const { slug } = req.params;

      const book = await Book.findOne({
        where: { slug: slug, status: 'COMPLETED' },
        include: [{
          model: Summary,
          as: 'summaries',
          where: { status: 'COMPLETED' },
          required: false,
          attributes: ['content'],
          // <<< CORREÇÃO 2: Nested Include - Incluímos o usuário DENTRO do resumo >>>
          include: [{
            model: User,
            as: 'user',
            attributes: ['name'] // Pedimos apenas o nome do usuário
          }]
        }]
      });

      if (!book) {
        return res.status(404).json({ error: "Livro não encontrado ou aguardando aprovação." });
      }
      
      // <<< CORREÇÃO 3: Extrair os dados para enviar ao frontend >>>
      // Pegamos o primeiro resumo aprovado, se houver
      const summaryData = book.summaries && book.summaries.length > 0 ? book.summaries[0] : null;

      const formattedBook = {
        id: book.id,
        title: book.title,
        author: book.author,
        category: book.category,
        slug: book.slug,
        cover_url: book.full_cover_url,
        // Se houver um resumo, pegamos o conteúdo
        summary: summaryData ? summaryData.content : null,
        // Se houver um usuário no resumo, pegamos o nome dele
        submitted_by: summaryData && summaryData.user ? summaryData.user.name : null,
      };

      return res.json(formattedBook);
    } catch (error) {
      console.error("🔥 ERRO AO BUSCAR DETALHES DO LIVRO:", error);
      return res.status(500).json({ error: "Erro ao buscar detalhes do livro." });
    }
  }
}

module.exports = new BookController();