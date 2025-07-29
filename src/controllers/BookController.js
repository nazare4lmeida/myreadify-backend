const { Book, Summary, User } = require("../models");

class BookController {
  
  async index(req, res) {
    try {
      const books = await Book.findAll({
        where: { status: "COMPLETED" },
        order: [["title", "ASC"]],
        // Inclui o campo virtual 'full_cover_url' para que o Sequelize o retorne
        attributes: ["id", "title", "author", "category", "slug", "cover_url", "full_cover_url"],
      });

      // Retorna os livros diretamente. O frontend usará 'full_cover_url' via getImageUrl.
      return res.json(books); 
    } catch (error) {
      console.error("🔥 ERRO AO BUSCAR LIVROS:", error);
      return res.status(500).json({ error: "Erro ao buscar livros." });
    }
  }

  async show(req, res) {
    try {
      const { slug } = req.params;

      const book = await Book.findOne({
        where: { slug: slug, status: 'COMPLETED' },
        // Inclui o campo virtual 'full_cover_url' para que o Sequelize o retorne
        attributes: ["id", "title", "author", "category", "slug", "cover_url", "full_cover_url"],
        include: [{
          model: Summary,
          as: 'summaries',
          where: { status: 'COMPLETED' },
          required: false,
          attributes: ['content'],
          include: [{
            model: User,
            as: 'user',
            attributes: ['name']
          }]
        }]
      });

      if (!book) {
        return res.status(404).json({ error: "Livro não encontrado ou aguardando aprovação." });
      }
      
      // Formata o objeto do livro para a resposta da API.
      // A 'cover_url' agora será a 'full_cover_url' que o backend já gerou.
      const summaryData = book.summaries && book.summaries.length > 0 ? book.summaries[0] : null;

      const formattedBook = {
        id: book.id,
        title: book.title,
        author: book.author,
        category: book.category,
        slug: book.slug,
        cover_url: book.full_cover_url, // Usa o campo virtual que já é a URL completa
        summary: summaryData ? summaryData.content : null,
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
