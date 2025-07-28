// src/controllers/SummaryController.js (VERSÃO FINAL COMPLETA E CORRIGIDA)

const { Summary, Book } = require("../models");
const slugify = require("slugify");

class SummaryController {
  
  // A função store já está correta e não precisa de alterações.
  async store(req, res) {
    try {
      const { title, author, category, content } = req.body;
      const coverImage = req.file ? req.file.filename : null;

      if (!title) {
        return res.status(400).json({ error: "O título é obrigatório para criar um novo livro." });
      }

      const bookSlug = slugify(title, { lower: true, strict: true });

      const [book] = await Book.findOrCreate({
        where: { slug: bookSlug },
        defaults: {
          title: title,
          author: author,
          category: category,
          cover_url: coverImage,
          slug: bookSlug,
          status: 'PENDING',
        }
      });

      const summary = await Summary.create({
        content: content,
        status: "PENDING",
        user_id: req.userId,
        book_id: book.id,
      });

      return res.status(201).json(summary);

    } catch (error) {
      console.error("ERRO DETALHADO AO CRIAR RESUMO:", error);
      return res.status(500).json({ error: "Erro ao cadastrar resumo." });
    }
  }

  // A correção está na função getMySummaries
  async getMySummaries(req, res) {
    try {
      const summaries = await Summary.findAll({
        where: { user_id: req.userId },
        include: [
          {
            model: Book,
            as: "book",
            attributes: ["title", "author", "slug", "cover_url"],
          },
        ],
        // <<< CORREÇÃO PRINCIPAL AQUI >>>
        // Usamos o nome real da coluna do banco de dados (snake_case) na ordenação.
        order: [["created_at", "DESC"]],
      });

      // O resto da formatação já está correto e funcionará.
      const formattedSummaries = summaries
        .map((s) => {
          if (!s.book) return null;
          return {
            id: s.id,
            status: s.status,
            title: s.book.title,
            author: s.book.author,
            slug: s.book.slug,
            cover_url: s.book.full_cover_url,
          };
        })
        .filter((s) => s !== null);

      return res.status(200).json(formattedSummaries);
    } catch (error) {
      console.error("Erro ao buscar 'meus resumos':", error);
      return res.status(500).json({ error: "Erro ao buscar seus envios." });
    }
  }
}

module.exports = new SummaryController();