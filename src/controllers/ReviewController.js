const { Review, Book, User } = require("../models");

class ReviewController {
  // Criar avaliação
  async store(req, res) {
    const { rating, content } = req.body;
    const { slug } = req.params;
    const userId = req.userId;

    try {
      if (!rating || !content) {
        return res.status(400).json({ error: "Nota e comentário são obrigatórios." });
      }

      // Incluir o campo virtual 'full_cover_url' ao buscar o livro
      const book = await Book.findOne({ where: { slug }, attributes: ["id", "title", "author", "cover_url", "full_cover_url", "slug"] });
      if (!book) {
        return res.status(404).json({ error: "Livro não encontrado." });
      }

      const existingReview = await Review.findOne({
        where: { user_id: userId, book_id: book.id },
      });
      if (existingReview) {
        return res.status(409).json({ error: "Você já avaliou este livro." });
      }

      const review = await Review.create({
        rating,
        content,
        user_id: userId,
        book_id: book.id,
        slug: book.slug,
      });

      const user = await User.findByPk(userId, { attributes: ["id", "name"] });

      // Retornar o livro com a full_cover_url para o frontend
      const responseData = {
        ...review.toJSON(),
        userId: user.id,
        user: user.toJSON(),
        book: { // Incluir dados do livro, especialmente a capa resolvida
          id: book.id,
          title: book.title,
          slug: book.slug,
          cover_url: book.full_cover_url, // Envia a URL já resolvida pelo getter
        },
      };

      return res.status(201).json(responseData);
    } catch (err) {
      console.error("Erro ao criar avaliação:", err);
      return res.status(500).json({ error: "Falha ao criar a avaliação." });
    }
  }

  // Listar avaliações de um livro
  async index(req, res) {
    const { slug } = req.params;
    try {
      const book = await Book.findOne({ where: { slug } });
      if (!book) {
        return res.status(404).json({ error: "Livro não encontrado." });
      }

      const reviews = await Review.findAll({
        where: { book_id: book.id },
        order: [["created_at", "DESC"]],
        include: [
          { model: User, as: "user", attributes: ["id", "name"] },
          { 
            model: Book, 
            as: "book", 
            // Incluir o campo virtual 'full_cover_url' no book incluído
            attributes: ["id", "title", "cover_url", "slug", "full_cover_url"] 
          },
        ],
      });

      // Garantir que cada review tenha userId e cover_url
      const formattedReviews = reviews.map((rev) => ({
        ...rev.toJSON(),
        userId: rev.user?.id,
        // Acessar a full_cover_url do livro aninhado
        book: {
          ...rev.book.toJSON(),
          cover_url: rev.book.full_cover_url,
        },
      }));

      return res.status(200).json(formattedReviews);
    } catch (err) {
      console.error("Erro ao listar avaliações:", err);
      return res.status(500).json({ error: "Falha ao listar avaliações." });
    }
  }

  // Listar minhas avaliações
  async showMyReviews(req, res) {
    const userId = req.userId;
    try {
      const reviews = await Review.findAll({
        where: { user_id: userId },
        include: [
          {
            model: Book,
            as: "book",
            // Incluir o campo virtual 'full_cover_url'
            attributes: ["id", "title", "cover_url", "slug", "full_cover_url"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      const formattedReviews = reviews.map((rev) => ({
        ...rev.toJSON(),
        userId,
        // Acessar a full_cover_url do livro aninhado
        book: {
          ...rev.book.toJSON(),
          cover_url: rev.book.full_cover_url,
        },
      }));

      return res.json(formattedReviews);
    } catch (err) {
      console.error("Erro ao buscar minhas avaliações:", err);
      return res.status(500).json({ error: "Falha ao buscar suas avaliações." });
    }
  }

  // Atualizar avaliação
  async update(req, res) {
    const { reviewId } = req.params;
    const { rating, content } = req.body;
    const userId = req.userId;

    try {
      const review = await Review.findByPk(reviewId);
      if (!review) {
        return res.status(404).json({ error: "Avaliação não encontrada." });
      }

      if (review.user_id !== userId) {
        return res
          .status(403)
          .json({ error: "Você não tem permissão para editar esta avaliação." });
      }

      await review.update({ rating, content });

      // Incluir full_cover_url no book incluído após a atualização
      const updatedReview = await Review.findByPk(reviewId, {
        include: [
          { model: User, as: "user", attributes: ["id", "name"] },
          { 
            model: Book, 
            as: "book", 
            attributes: ["id", "title", "cover_url", "slug", "full_cover_url"] 
          }
        ],
      });

      return res.json({
        ...updatedReview.toJSON(),
        userId: userId,
        book: {
          ...updatedReview.book.toJSON(),
          cover_url: updatedReview.book.full_cover_url,
        },
      });
    } catch (err) {
      console.error("Erro ao atualizar avaliação:", err);
      return res.status(500).json({ error: "Falha ao atualizar a avaliação." });
    }
  }

  // Deletar avaliação
  async destroy(req, res) {
    const { reviewId } = req.params;
    const userId = req.userId;

    try {
      const review = await Review.findByPk(reviewId);
      if (!review) {
        return res.status(404).json({ error: "Avaliação não encontrada." });
      }

      if (review.user_id !== userId) {
        return res
          .status(403)
          .json({ error: "Você não tem permissão para deletar esta avaliação." });
      }

      await review.destroy();

      return res.status(204).send();
    } catch (err) {
      console.error("Erro ao deletar avaliação:", err);
      return res.status(500).json({ error: "Falha ao deletar a avaliação." });
    }
  }
}

module.exports = new ReviewController();
