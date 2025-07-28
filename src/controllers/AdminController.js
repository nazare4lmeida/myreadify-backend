// src/controllers/AdminController.js (Versão Final Completa e Corrigida)

// >>> CORREÇÃO 1: Adicionamos 'User' à importação <<<
const { Book, Summary, Message, User } = require('../models');
const fs = require('fs');
const path = require('path');

class AdminController {
  // As funções 'listPending' e 'listAll' para livros continuam aqui sem alteração
  async listPending(req, res) {
    try {
      const books = await Book.findAll({ where: { status: 'COMPLETED' } });
      return res.status(200).json(books);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar livros pendentes.' });
    }
  }

  async listAll(req, res) {
    try {
      const books = await Book.findAll({ where: { status: 'COMPLETED' } });
      return res.status(200).json(books);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar livros aprovados.' });
    }
  }

  // As funções de manipulação de livros continuam aqui sem alteração
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

      if (book.cover_url) {
        const oldPath = path.resolve(__dirname, '..', 'uploads', book.cover_url);
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
        const coverPath = path.resolve(__dirname, '..', 'uploads', book.cover_url);
        if (fs.existsSync(coverPath)) {
          fs.unlinkSync(coverPath);
        }
      }

      await book.destroy();
      return res.status(200).json({ message: 'Livro removido com sucesso.' });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao excluir livro.' });
    }
  }


  // >>> CORREÇÃO 2: Garantimos que a única 'listPendingSummaries' é a versão completa <<<
  async listPendingSummaries(req, res) {
    try {
      const summaries = await Summary.findAll({ 
        where: { status: 'PENDING' },
        // Esta parte inclui os dados necessários para o card
        include: [
          { model: Book, as: 'book', attributes: ['id', 'title', 'author', 'cover_url'] },
          { model: User, as: 'user', attributes: ['name'] }
        ],
        order: [['createdAt', 'ASC']],
      });
      return res.status(200).json(summaries);
    } catch (err) {
      console.error("Erro ao buscar resumos pendentes:", err);
      return res.status(500).json({ error: 'Erro ao buscar resumos pendentes.' });
    }
  }

  // A função para "Gerenciar Todos os Resumos", que busca todos os status
  async listAllSummaries(req, res) {
    try {
      const summaries = await Summary.findAll({
        include: [
          { model: Book, as: 'book', attributes: ['id', 'title', 'author'] },
        ],
        order: [['createdAt', 'DESC']],
      });
      return res.status(200).json(summaries);
    } catch (err) {
      console.error("Erro ao buscar todos os resumos:", err);
      return res.status(500).json({ error: 'Erro ao buscar todos os resumos.' });
    }
  }


  // As funções de manipulação de resumos continuam aqui sem alteração
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