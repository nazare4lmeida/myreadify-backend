// src/controllers/SummaryController.js (VERSÃO FINAL COMPLETA E CORRIGIDA)

const { Summary, Book } = require("../models");
const slugify = require("slugify");

class SummaryController {
  
  // A função 'store' já está correta para lidar com livros novos e livros do mock.
  async store(req, res) {
    try {
      const { title, author, category, content, slug: providedSlug, coverUrlMock } = req.body;
      const coverImage = req.file ? req.file.filename : coverUrlMock; // coverImage será o nome do arquivo

      if (!coverImage) {
          return res.status(400).json({ error: "A imagem da capa é obrigatória." });
      }
      if (!title) {
        return res.status(400).json({ error: "O título é obrigatório." });
      }

      const bookSlug = providedSlug || slugify(title, { lower: true, strict: true });

      const [book] = await Book.findOrCreate({
        where: { slug: bookSlug },
        defaults: {
          title: title,
          author: author,
          category: category,
          cover_url: coverImage, // cover_url armazena APENAS o nome do arquivo
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

  // A correção final está aqui, na função getMySummaries
  async getMySummaries(req, res) {
    try {
      const summaries = await Summary.findAll({
        where: { user_id: req.userId },
        include: [
          {
            model: Book,
            as: "book",
            // CORREÇÃO AQUI: Inclua 'full_cover_url' nos atributos do livro incluído
            attributes: ["title", "author", "slug", "cover_url", "full_cover_url"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      // Mapeie para garantir que o cover_url do resumo seja o full_cover_url do livro
      const formattedSummaries = summaries
        .map((s) => {
          if (!s.book) return null;
          
          return {
            id: s.id,
            status: s.status,
            title: s.book.title,
            author: s.book.author,
            slug: s.book.slug,
            cover_url: s.book.full_cover_url, // Use o campo virtual direto
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
