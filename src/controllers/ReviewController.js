// src/controllers/ReviewController.js
const Review = require('../models/Review');
const Book = require('../models/Book');
const User = require('../models/User');

class ReviewController {
  // --- CREATE: Adicionar uma nova avaliação a um livro (Rota Protegida) ---
  async store(req, res) {
    const { bookId } = req.params; // Pega o ID do livro da URL
    const { rating, comment } = req.body;
    const userId = req.userId; // Pega o ID do usuário do token (via middleware)

    try {
      // 1. Verifica se o livro existe
      const book = await Book.findByPk(bookId);
      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado.' });
      }

      // 2. Impede que um usuário avalie o mesmo livro duas vezes
      const existingReview = await Review.findOne({
        where: { user_id: userId, book_id: bookId },
      });

      if (existingReview) {
        return res.status(403).json({ error: 'Você já avaliou este livro.' });
      }

      // 3. Cria a avaliação no banco de dados
      const review = await Review.create({
        rating,
        comment,
        user_id: userId,
        book_id: bookId,
      });

      return res.status(201).json(review);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Falha ao criar a avaliação.' });
    }
  }

  // --- READ: Listar todas as avaliações de um livro específico (Rota Pública) ---
  async index(req, res) {
    const { bookId } = req.params;

    try {
      // Verifica se o livro existe para não listar avaliações de um livro deletado
      const book = await Book.findByPk(bookId);
      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado.' });
      }

      const reviews = await Review.findAll({
        where: { book_id: bookId },
        order: [['created_at', 'DESC']], // Mais recentes primeiro
        include: { // Inclui os dados do usuário que fez a avaliação
          model: User,
          as: 'user',
          attributes: ['id', 'name'], // Pega apenas o ID e o nome para não expor dados sensíveis
        },
      });

      return res.json(reviews);
    } catch (err) {
      return res.status(500).json({ error: 'Falha ao listar as avaliações.' });
    }
  }
}

module.exports = new ReviewController();