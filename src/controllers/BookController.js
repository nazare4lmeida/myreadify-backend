const { Book, Summary, User } = require("../models");

class BookController {
  // A função 'index' para a página de Categorias já está correta.
  async index(req, res) {
    try {
      const books = await Book.findAll({
        where: { status: "COMPLETED" },
        order: [["title", "ASC"]], // CORREÇÃO AQUI: Inclua 'full_cover_url' nos atributos para que seja retornado pela API
        attributes: [
          "id",
          "title",
          "author",
          "category",
          "slug",
          "cover_url",
          "full_cover_url",
        ],
      }); // Não é mais necessário formatar aqui, o getter 'full_cover_url' já faz o trabalho

      return res.json(books);
    } catch (error) {
      console.error("🔥 ERRO AO BUSCAR LIVROS:", error);
      return res.status(500).json({ error: "Erro ao buscar livros." });
    }
  } // A função 'show'

  async show(req, res) {
    try {
      const { slug } = req.params;

      const book = await Book.findOne({
        where: { slug: slug, status: "COMPLETED" }, // CORREÇÃO AQUI: Inclua 'full_cover_url' nos atributos do livro principal
        attributes: [
          "id",
          "title",
          "author",
          "category",
          "slug",
          "cover_url",
          "full_cover_url",
        ],
        include: [
          {
            model: Summary,
            as: "summaries",
            where: { status: "COMPLETED" },
            required: false,
            attributes: ["content"],
            include: [
              {
                model: User,
                as: "user",
                attributes: ["name"],
              },
            ],
          },
        ],
      });

      if (!book) {
        return res
          .status(404)
          .json({ error: "Livro não encontrado ou aguardando aprovação." });
      } // Nenhuma lógica condicional para cover_url aqui. Apenas use o valor já retornado.
      const formattedBook = {
        id: book.id,
        title: book.title,
        author: book.author,
        category: book.category,
        slug: book.slug,
        cover_url: book.full_cover_url, // Usar o campo virtual que já é a URL completa
        summary:
          book.summaries && book.summaries.length > 0
            ? book.summaries[0].content
            : null,
        submitted_by:
          book.summaries && book.summaries.length > 0 && book.summaries[0].user
            ? book.summaries[0].user.name
            : null,
      };

      return res.json(formattedBook);
    } catch (error) {
      console.error("🔥 ERRO AO BUSCAR DETALHES DO LIVRO:", error);
      return res
        .status(500)
        .json({ error: "Erro ao buscar detalhes do livro." });
    }
  }
}

module.exports = new BookController();
