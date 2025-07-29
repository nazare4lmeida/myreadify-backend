const { Review, Book, User } = require("../models");

class ReviewController {
  // Criar avaliação
  async store(req, res) {
    const { rating, content } = req.body;
    const { slug } = req.params;
    const userId = req.userId;

    // Logs para depuração no terminal do seu backend
    console.log("Backend: Recebida requisição para criar avaliação:", { rating, content, slug, userId });

    try {
      if (!rating || !content) {
        return res
          .status(400)
          .json({ error: "Nota e comentário são obrigatórios." });
      }

      const book = await Book.findOne({ where: { slug } });
      if (!book) {
        console.log("Backend: Livro com slug não encontrado:", slug);
        return res.status(404).json({ error: "Livro não encontrado." });
      }

      const existingReview = await Review.findOne({
        where: { user_id: userId, book_id: book.id },
      });
      if (existingReview) {
        console.log("Backend: Usuário já avaliou este livro.");
        return res.status(409).json({ error: "Você já avaliou este livro." });
      }

      console.log("Backend: Criando avaliação no banco de dados...");
      const review = await Review.create({
        rating,
        content,
        user_id: userId,
        book_id: book.id,
        slug: book.slug, // Mantendo caso seu modelo precise
      });

      console.log("Backend: Avaliação criada com ID:", review.id);

      // Em vez de buscar a avaliação inteira novamente, buscamos apenas os dados do usuário
      const user = await User.findByPk(userId, { attributes: ["id", "name"] });

      // Combinamos os dados da avaliação recém-criada com os dados do usuário
      const responseData = {
        ...review.toJSON(),
        user: user.toJSON(),
      };

      console.log("Backend: Enviando resposta de sucesso para o frontend.");
      return res.status(201).json(responseData);

    } catch (err) {
      console.error("Backend: ERRO CRÍTICO ao criar avaliação:", err);
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
        include: { model: User, as: "user", attributes: ["id", "name"] },
      });

      return res.status(200).json(reviews || []);
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
            attributes: ["id", "title", "cover_url", "slug"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      return res.json(reviews);
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
        include: { model: User, as: "user", attributes: ["id", "name"] },
      });

      return res.json(updatedReview);
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