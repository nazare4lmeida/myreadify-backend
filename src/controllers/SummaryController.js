const { Summary, Book } = require("../models");
const slugify = require("slugify");

class SummaryController {
  
  async store(req, res) {
    try {
      const { title, author, category, content, slug: providedSlug, coverUrlMock } = req.body;
      // Para livros do mock, coverUrlMock virá como o caminho relativo (ex: '/src/assets/lordoftherings.jpg')
      // Para uploads, req.file.filename virá com o nome do arquivo gerado pelo Multer (ex: 'hash-xyz.jpg')
      const coverImageToSave = req.file ? req.file.filename : coverUrlMock;

      if (!coverImageToSave) {
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
          cover_url: coverImageToSave, // Salva o nome do arquivo OU o caminho relativo
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

  async getMySummaries(req, res) {
    try {
      const summaries = await Summary.findAll({
        where: { user_id: req.userId },
        include: [
          {
            model: Book,
            as: "book",
            // Incluir o campo virtual 'full_cover_url'
            attributes: ["title", "author", "slug", "cover_url", "full_cover_url"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      // Mapear para garantir que o cover_url do resumo seja o full_cover_url do livro
      const formattedSummaries = summaries
        .map((s) => {
          if (!s.book) return null; // Retorna null para resumos sem livro associado

          return {
            id: s.id,
            status: s.status,
            title: s.book.title,
            author: s.book.author,
            slug: s.book.slug,
            // Envie a full_cover_url que o backend gerou, o frontend vai consumir
            cover_url: s.book.full_cover_url, 
          };
        })
        .filter((s) => s !== null); // Remove qualquer entrada nula

      return res.status(200).json(formattedSummaries);
    } catch (error) {
      console.error("Erro ao buscar 'meus resumos':", error);
      return res.status(500).json({ error: "Erro ao buscar seus envios." });
    }
  }
}

module.exports = new SummaryController();
