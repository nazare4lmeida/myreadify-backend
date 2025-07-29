const { Book, Summary, User } = require("../models");

class BookController {
  // A função 'index' para a página de Categorias já está correta.
  async index(req, res) {
    try {
      const books = await Book.findAll({
        where: { status: "COMPLETED" },
        order: [["title", "ASC"]],
        // CORREÇÃO: Removido "full_cover_url" dos atributos selecionados.
        // Getters (campos virtuais) não devem ser listados aqui,
        // eles são acessados diretamente no objeto do modelo.
        attributes: ["id", "title", "author", "category", "slug", "cover_url"],
      });

      const formattedBooks = books.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        category: book.category,
        slug: book.slug,
        cover_url: book.full_cover_url, // Continua usando o getter aqui, que está correto.
      }));

      return res.json(formattedBooks);
    } catch (error) {
      console.error("🔥 ERRO AO BUSCAR LIVROS:", error);
      return res.status(500).json({ error: "Erro ao buscar livros." });
    }
  }

  // <<< A CORREÇÃO FINAL ESTÁ AQUI, NA FUNÇÃO 'show' >>>
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
          include: [{
            model: User,
            as: 'user',
            attributes: ['name']
          }]
        }],
        // CORREÇÃO: Removido "full_cover_url" dos atributos selecionados aqui também.
        // O getter será acessado no objeto 'book' diretamente.
        attributes: ["id", "title", "author", "category", "slug", "cover_url"],
      });

      if (!book) {
        return res.status(404).json({ error: "Livro não encontrado ou aguardando aprovação." });
      }

      // Aplicamos a mesma lógica inteligente que funcionou antes
      // Esta lógica usa o getter 'full_cover_url' corretamente.
      const finalCoverUrl = book.cover_url && book.cover_url.startsWith('/src/assets')
        ? book.cover_url
        : book.full_cover_url; 

      const summaryData = book.summaries && book.summaries.length > 0 ? book.summaries[0] : null;

      const formattedBook = {
        id: book.id,
        title: book.title,
        author: book.author,
        category: book.category,
        slug: book.slug,
        cover_url: finalCoverUrl, 
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
