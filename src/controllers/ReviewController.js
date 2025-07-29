const { Review, Book, User, Summary } = require("../models");

class ReviewController {
  // A função store e as outras não são o problema, mas as deixamos aqui.
  async store(req, res) {
    /* ...código completo da função store... */
  }

  // <<< A FUNÇÃO QUE ESTÁ FALHANDO E QUE VAMOS DIAGNOSTICAR >>>
  async index(req, res) {
    try {
      console.log("-----------------------------------------");
      console.log("LOG 1: A requisição para buscar reviews começou.");

      const { slug } = req.params;
      console.log(`LOG 2: Slug recebido da URL = ${slug}`);

      if (!slug) {
        console.log("LOG 2.1: Erro! Nenhum slug foi fornecido na URL.");
        return res.status(400).json({ error: "Slug do livro não fornecido." });
      }

      // Vamos buscar o livro usando o slug para obter seu ID.
      const book = await Book.findOne({ where: { slug: slug } });
      console.log(
        "LOG 3: Resultado da busca do livro pelo slug:",
        book
          ? `Livro encontrado com ID ${book.id}`
          : "Nenhum livro encontrado com este slug."
      );

      if (!book) {
        console.log("LOG 3.1: Erro! O livro não existe no banco de dados.");
        return res.status(404).json({ error: "Livro não encontrado." });
      }

      console.log(`LOG 4: Tentando buscar reviews para o book_id = ${book.id}`);

      // Esta é a busca final e o ponto mais provável do erro.
      const reviews = await Review.findAll({
        where: { book_id: book.id },
        order: [["created_at", "DESC"]],
        include: {
          model: User,
          as: "user",
          attributes: ["id", "name"],
        },
      });

      console.log(
        `LOG 5: Busca de reviews concluída. Encontradas ${reviews.length} avaliações.`
      );
      console.log("-----------------------------------------");
      return res.json(reviews);
    } catch (err) {
      // <<< ESTE É O LOG MAIS IMPORTANTE DE TODOS >>>
      // Se o código cair aqui, este log nos dará o erro exato do Sequelize/Banco de Dados.
      console.error("🔥 🔥 🔥 ERRO PEGO NO BLOCO CATCH! 🔥 🔥 🔥");
      console.error("O erro detalhado é:", err);
      console.error("-----------------------------------------");

      return res.status(500).json({ error: "Falha ao listar as avaliações." });
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
            as: "book",
            attributes: ["id", "title", "cover_url"],
          },
          {
            model: Summary,
            as: "summary",
            attributes: ["id", "title"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      return res.json(reviews);
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Falha ao buscar suas avaliações." });
    }
  }

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
        return res.status(403).json({
          error: "Você não tem permissão para editar esta avaliação.",
        });
      }

      await review.update({ rating, content });

      const updatedReview = await Review.findByPk(reviewId, {
        include: { model: User, as: "user", attributes: ["id", "name"] },
      });

      return res.json(updatedReview);
    } catch (err) {
      return res.status(500).json({ error: "Falha ao atualizar a avaliação." });
    }
  }

  async destroy(req, res) {
    const { reviewId } = req.params;
    const userId = req.userId;

    try {
      const review = await Review.findByPk(reviewId);
      if (!review) {
        return res.status(404).json({ error: "Avaliação não encontrada." });
      }

      if (review.user_id !== userId) {
        return res.status(403).json({
          error: "Você não tem permissão para deletar esta avaliação.",
        });
      }

      await review.destroy();

      return res.status(204).send();
    } catch (err) {
      return res.status(500).json({ error: "Falha ao deletar a avaliação." });
    }
  }
}

module.exports = new ReviewController();
