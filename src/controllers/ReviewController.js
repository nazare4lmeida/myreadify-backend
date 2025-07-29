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

      const book = await Book.findOne({ where: { slug } });
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

      // CORREÇÃO AQUI: Garanta que o book e seu full_cover_url sejam retornados
      const responseData = {
        ...review.toJSON(),
        userId: user.id,
        user: user.toJSON(),
        book: { // Incluir dados do livro, incluindo full_cover_url
          id: book.id,
          title: book.title,
          cover_url: book.full_cover_url, // Usar o campo virtual
          slug: book.slug
        }
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
            // CORREÇÃO AQUI: Inclua 'full_cover_url' nos atributos do livro incluído
            attributes: ["id", "title", "full_cover_url", "slug"] 
          },
        ],
      });

      // Garantir que cada review tenha userId e cover_url do livro
      const formattedReviews = reviews.map((rev) => ({
        ...rev.toJSON(),
        userId: rev.user?.id,
        book: {
          ...rev.book.toJSON(),
          cover_url: rev.book.full_cover_url // Use o campo virtual para a capa
        }
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
            // CORREÇÃO AQUI: Inclua 'full_cover_url' nos atributos do livro incluído
            attributes: ["id", "title", "cover_url", "slug", "full_cover_url"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      const formattedReviews = reviews.map((rev) => ({
        ...rev.toJSON(),
        userId,
        book: {
          ...rev.book.toJSON(),
          cover_url: rev.book.full_cover_url // Use o campo virtual para a capa
        }
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

      const updatedReview = await Review.findByPk(reviewId, {
        include: [
          { model: User, as: "user", attributes: ["id", "name"] },
          { 
            model: Book, 
            as: "book", 
            // CORREÇÃO AQUI: Inclua 'full_cover_url' nos atributos do livro incluído
            attributes: ["id", "title", "full_cover_url", "slug"] 
          },
        ],
      });

      return res.json({
        ...updatedReview.toJSON(),
        userId: userId,
        book: {
          ...updatedReview.book.toJSON(),
          cover_url: updatedReview.book.full_cover_url // Use o campo virtual
        }
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
