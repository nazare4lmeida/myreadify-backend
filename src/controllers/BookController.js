const { Book, Summary, User } = require("../models");

class BookController {
  
  async index(req, res) {
    try {
      const books = await Book.findAll({
        where: { status: "COMPLETED" },
        order: [["title", "ASC"]],
        // Solicita o cover_url e o full_cover_url (getter)
        attributes: ["id", "title", "author", "category", "slug", "cover_url", "full_cover_url"],
      });

      // Mapeia para garantir que o frontend receba 'cover_url' com a URL COMPLETA
      const formattedBooks = books.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        category: book.category,
        slug: book.slug,
        // CORREÇÃO: Usa o full_cover_url diretamente
        cover_url: book.full_cover_url, 
      }));

      return res.json(formattedBooks);
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
        // Solicita o cover_url e o full_cover_url (getter)
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
      
      // CORREÇÃO: Remove a lógica inteligente aqui. O getter 'full_cover_url' já faz isso.
      // O frontend agora só precisa usar book.full_cover_url diretamente.
      const finalCoverUrl = book.full_cover_url; 

      const summaryData = book.summaries && book.summaries.length > 0 ? book.summaries[0] : null;

      const formattedBook = {
        id: book.id,
        title: book.title,
        author: book.author,
        category: book.category,
        slug: book.slug,
        cover_url: finalCoverUrl, // Usa a URL final e correta do getter
        summary: summaryData ? summaryData.content : null,
        submitted_by: summaryData && summaryData.user ? summaryData.user.name : null,
      };

      return res.json(formattedFormattedBook);
    } catch (error) {
      console.error("🔥 ERRO AO BUSCAR DETALHES DO LIVRO:", error);
      return res.status(500).json({ error: "Erro ao buscar detalhes do livro." });
    }
  }
}

module.exports = new BookController();
