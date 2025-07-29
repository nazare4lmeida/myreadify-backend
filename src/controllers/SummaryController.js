// src/controllers/SummaryController.js (VERSÃO FINAL COMPLETA E CORRIGIDA)

const { Summary, Book } = require("../models");
const slugify = require("slugify");

class SummaryController {
  
  async store(req, res) {
    try {
      const { title, author, category, content, slug: providedSlug, coverUrlMock } = req.body;
      // Multer anexa o arquivo em req.file
      const coverImage = req.file ? req.file.filename : coverUrlMock; // coverUrlMock deve ser o filename, não o path completo

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
          // Se for um livro do mock, coverImage virá como '/src/assets/...'
          // Se for um upload, coverImage virá como 'hash-filename.jpg'
          cover_url: coverImage, 
          slug: bookSlug,
          status: 'PENDING',
        }
      });

      const summary = await Summary.create({
        content: content,
        status: "PENDING",
        user_id: req.userId, // Depende do authMiddleware
        book_id: book.id,
      });

      return res.status(201).json(summary);

    } catch (error) {
      console.error("ERRO DETALHADO AO CRIAR RESUMO:", error);
      return res.status(500).json({ error: "Erro ao cadastrar resumo." });
    }
  }

  async getMySummaries(req, res) {
    try {
      const summaries = await Summary.findAll({
        where: { user_id: req.userId }, // Depende do authMiddleware
        include: [
          {
            model: Book,
            as: "book",
            attributes: ["title", "author", "slug", "cover_url", "full_cover_url"], // Adicionado full_cover_url
          },
        ],
        order: [["created_at", "DESC"]],
      });

      const formattedSummaries = summaries
        .map((s) => {
          if (!s.book) return null;
          
          // CORREÇÃO: Usamos o full_cover_url do getter do modelo Book
          // O frontend não precisa mais ter lógica complexa de resolução de URL aqui
          const finalCoverUrl = s.book.full_cover_url; 

          return {
            id: s.id,
            status: s.status,
            title: s.book.title,
            author: s.book.author,
            slug: s.book.slug,
            cover_url: finalCoverUrl, // Envia a URL final e correta para o frontend
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
