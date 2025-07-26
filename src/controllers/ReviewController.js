const { Review, Book, Summary, User } = require('../models');

class ReviewController {
  async store(req, res) {
    const { rating, comment, summary_id } = req.body;
    const { bookId } = req.params; // bookId vem da rota se for avaliação de livro
    const userId = req.userId;

    // Validação: deve ser book_id OU summary_id
    if ((!bookId && !summary_id) || (bookId && summary_id)) {
      return res.status(400).json({
        error: 'Informe apenas bookId (param) ou summary_id (body), nunca ambos.',
      });
    }

    try {
      if (bookId) {
        // Verifica se o livro existe
        const book = await Book.findByPk(bookId);
        if (!book) {
          return res.status(404).json({ error: 'Livro não encontrado.' });
        }

        // Verifica duplicidade
        const existingReview = await Review.findOne({
          where: { user_id: userId, book_id: bookId },
        });
        if (existingReview) {
          return res.status(409).json({ error: 'Você já avaliou este livro.' });
        }

        const review = await Review.create({
          rating,
          comment,
          user_id: userId,
          book_id: bookId,
        });

        const createdReview = await Review.findByPk(review.id, {
          include: { model: User, as: 'user', attributes: ['id', 'name'] },
        });

        return res.status(201).json(createdReview);
      }

      // summary_id está presente
      const summary = await Summary.findByPk(summary_id);
      if (!summary) {
        return res.status(404).json({ error: 'Resumo não encontrado.' });
      }

      const existingReview = await Review.findOne({
        where: { user_id: userId, summary_id },
      });
      if (existingReview) {
        return res.status(409).json({ error: 'Você já avaliou este resumo.' });
      }

      const review = await Review.create({
        rating,
        comment,
        user_id: userId,
        summary_id,
      });

      const createdReview = await Review.findByPk(review.id, {
        include: { model: User, as: 'user', attributes: ['id', 'name'] },
      });

      return res.status(201).json(createdReview);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Falha ao criar a avaliação.' });
    }
  }

  async index(req, res) {
    const { bookId, summaryId } = req.params;

    try {
      if (bookId) {
        const book = await Book.findByPk(bookId);
        if (!book) {
          return res.status(404).json({ error: 'Livro não encontrado.' });
        }

        const reviews = await Review.findAll({
          where: { book_id: bookId },
          order: [['created_at', 'DESC']],
          include: {
            model: User,
            as: 'user',
            attributes: ['id', 'name'],
          },
        });

        return res.json(reviews);
      }

      if (summaryId) {
        const summary = await Summary.findByPk(summaryId);
        if (!summary) {
          return res.status(404).json({ error: 'Resumo não encontrado.' });
        }

        const reviews = await Review.findAll({
          where: { summary_id: summaryId },
          order: [['created_at', 'DESC']],
          include: {
            model: User,
            as: 'user',
            attributes: ['id', 'name'],
          },
        });

        return res.json(reviews);
      }

      return res.status(400).json({ error: 'Informe bookId ou summaryId na rota.' });
    } catch (err) {
      return res.status(500).json({ error: 'Falha ao listar as avaliações.' });
    }
  }

  async showMyReviews(req, res) {
    const userId = req.userId;

    try {
      const reviews = await Review.findAll({
        where: { user_id: userId },
        include: [
          {
            model: Book,
            as: 'book',
            attributes: ['id', 'title', 'cover_url'],
          },
          {
            model: Summary,
            as: 'summary',
            attributes: ['id', 'title'],
          },
        ],
        order: [['created_at', 'DESC']],
      });

      return res.json(reviews);
    } catch (err) {
      return res.status(500).json({ error: 'Falha ao buscar suas avaliações.' });
    }
  }

  async update(req, res) {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.userId;

    try {
      const review = await Review.findByPk(reviewId);
      if (!review) {
        return res.status(404).json({ error: 'Avaliação não encontrada.' });
      }

      if (review.user_id !== userId) {
        return res.status(403).json({ error: 'Você não tem permissão para editar esta avaliação.' });
      }

      await review.update({ rating, comment });

      const updatedReview = await Review.findByPk(reviewId, {
        include: { model: User, as: 'user', attributes: ['id', 'name'] },
      });

      return res.json(updatedReview);
    } catch (err) {
      return res.status(500).json({ error: 'Falha ao atualizar a avaliação.' });
    }
  }

  async destroy(req, res) {
    const { reviewId } = req.params;
    const userId = req.userId;

    try {
      const review = await Review.findByPk(reviewId);
      if (!review) {
        return res.status(404).json({ error: 'Avaliação não encontrada.' });
      }

      if (review.user_id !== userId) {
        return res.status(403).json({ error: 'Você não tem permissão para deletar esta avaliação.' });
      }

      await review.destroy();

      return res.status(204).send();
    } catch (err) {
      return res.status(500).json({ error: 'Falha ao deletar a avaliação.' });
    }
  }
}

module.exports = new ReviewController();
