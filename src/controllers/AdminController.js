const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const { Book, User } = require('../models').models; 

const unlinkAsync = promisify(fs.unlink);

class AdminController {
  async listPending(req, res) {
    try {
      const pendingBooks = await Book.findAll({
        where: { status: 'PENDING' },
        order: [['createdAt', 'ASC']],
        include: {
          model: User,
          as: 'submitter',
          attributes: ['id', 'name'],
        },
      });
      return res.json(pendingBooks);
    } catch (err) {
      return res.status(500).json({ error: 'Falha ao buscar resumos pendentes.' });
    }
  }

  async updateBookStatus(req, res) {
    const { bookId } = req.params;
    const { status } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Status fornecido é inválido.' });
    }

    try {
      const book = await Book.findByPk(bookId);
      if (!book) {
        return res.status(404).json({ error: 'Resumo não encontrado.' });
      }

      book.status = status;
      await book.save();

      return res.json(book);
    } catch (err) {
      return res.status(500).json({ error: 'Falha ao atualizar o status do resumo.' });
    }
  }

  // --- Método para LISTAR TODOS os resumos ---
  async listAll(req, res) {
    try {
      const allBooks = await Book.findAll({
        order: [['createdAt', 'DESC']],
        include: { model: User, as: 'submitter', attributes: ['name'] }
      });
      return res.json(allBooks);
    } catch (err) {
      return res.status(500).json({ error: 'Falha ao buscar todos os resumos.' });
    }
  }

  async deleteBook(req, res) {
    const { bookId } = req.params;

    try {
      const book = await Book.findByPk(bookId);
      if (!book) {
        return res.status(404).json({ error: 'Resumo não encontrado.' });
      }

      if (book.cover_url) {
        const imagePath = path.resolve(
          __dirname, '..', '..', 'tmp', 'uploads', book.cover_url
        );
        try {
          await unlinkAsync(imagePath);
        } catch (fileErr) {
          console.warn(`Arquivo de imagem não encontrado para deletar: ${imagePath}`);
        }
      }

      await book.destroy();

      return res.status(204).send();
    } catch (err) {
      console.error("Erro ao deletar livro:", err);
      return res.status(500).json({ error: 'Falha ao deletar o resumo.' });
    }
  }
}

module.exports = new AdminController();