const { Book, Summary, Message } = require('../models');
const fs = require('fs');
const { url } = require('inspector');
const path = require('path');

class AdminController {
  async listPending(req, res) {
    try {
      const books = await Book.findAll({ where: { status: 'PENDING' } });
      return res.status(200).json(books);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar livros pendentes.' });
    }
  }

  async listAll(req, res) {
    try {
      const books = await Book.findAll({ where: { status: 'APPROVED' } });
      return res.status(200).json(books);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar livros aprovados.' });
    }
  }

  async updateBookStatus(req, res) {
    const { bookId } = req.params;
    const { status } = req.body;

    try {
      const book = await Book.findByPk(bookId);

      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado.' });
      }

      book.status = status;
      await book.save();

      return res.status(200).json({ message: 'Status atualizado com sucesso.' });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao atualizar status do livro.' });
    }
  }

  async updateCoverImage(req, res) {
    const { bookId } = req.params;

    try {
      const book = await Book.findByPk(bookId);

      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado.' });
      }

      // Remove imagem antiga
      if (book.cover_url) {
        const oldPath = url.resolve(__dirname, '..', '..', 'uploads', book.cover_url);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      const { filename } = req.file;
      book.cover_url = filename;
      await book.save();

      return res.status(200).json({ message: 'Capa atualizada com sucesso.' });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao atualizar capa do livro.' });
    }
  }

  async deleteBook(req, res) {
    const { bookId } = req.params;

    try {
      const book = await Book.findByPk(bookId);

      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado.' });
      }

      if (book.cover_url) {
        const coverPath = path.resolve(__dirname, '..', '..', 'uploads', book.cover_url);
        if (fs.existsSync(cover_url)) {
          fs.unlinkSync(cover_url);
        }
      }

      await book.destroy();
      return res.status(200).json({ message: 'Livro removido com sucesso.' });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao excluir livro.' });
    }
  }

  async listPendingSummaries(req, res) {
    try {
      const summaries = await Summary.findAll({ where: { status: 'PENDING' } });
      return res.status(200).json(summaries);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar resumos pendentes.' });
    }
  }

  async updateSummaryStatus(req, res) {
    const { summaryId } = req.params;
    const { status } = req.body;

    try {
      const summary = await Summary.findByPk(summaryId);

      if (!summary) {
        return res.status(404).json({ error: 'Resumo não encontrado.' });
      }

      summary.status = status;
      await summary.save();

      return res.status(200).json({ message: 'Status do resumo atualizado com sucesso.' });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao atualizar status do resumo.' });
    }
  }

  async deleteSummary(req, res) {
    const { summaryId } = req.params;

    try {
      const summary = await Summary.findByPk(summaryId);

      if (!summary) {
        return res.status(404).json({ error: 'Resumo não encontrado.' });
      }

      await summary.destroy();
      return res.status(200).json({ message: 'Resumo removido com sucesso.' });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao excluir resumo.' });
    }
  }
}

module.exports = new AdminController();
