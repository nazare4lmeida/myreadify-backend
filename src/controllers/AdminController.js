// src/controllers/AdminController.js

const fs = require('fs'); // Módulo File System do Node.js
const path = require('path'); // Módulo Path do Node.js
const { promisify } = require('util'); // Utilitário para converter callbacks em Promises

const Book = require('../models/Book');
const User = require('../models/User');

// Converte fs.unlink (baseado em callback) para uma função que retorna Promise
const unlinkAsync = promisify(fs.unlink);

class AdminController {
  // Lista todos os resumos com status 'PENDING' (seu método existente)
  async listPending(req, res) {
    try {
      const pendingBooks = await Book.findAll({
        where: { status: 'PENDING' },
        order: [['createdAt', 'ASC']],
        include: { model: User, as: 'submitter', attributes: ['id', 'name'] },
      });
      return res.json(pendingBooks);
    } catch (err) {
      return res.status(500).json({ error: 'Falha ao buscar resumos pendentes.' });
    }
  }
  
  // Atualiza o status de um livro (seu método existente)
  async updateBookStatus(req, res) {
    // ... (seu método updateBookStatus continua aqui, sem alterações) ...
  }

  // --- NOVO MÉTODO: Listar TODOS os livros ---
  async listAll(req, res) {
    try {
      const allBooks = await Book.findAll({
        order: [['createdAt', 'DESC']], // Mais recentes primeiro
        include: { model: User, as: 'submitter', attributes: ['name'] }
      });
      return res.json(allBooks);
    } catch (err) {
      return res.status(500).json({ error: 'Falha ao buscar todos os resumos.' });
    }
  }

  // --- NOVO MÉTODO: Deletar um livro ---
  async deleteBook(req, res) {
    const { bookId } = req.params;

    try {
      const book = await Book.findByPk(bookId);
      if (!book) {
        return res.status(404).json({ error: 'Resumo não encontrado.' });
      }

      // Deleta o arquivo da imagem da pasta tmp/uploads
      if (book.cover_url) {
        const imagePath = path.resolve(
          __dirname, '..', '..', 'tmp', 'uploads', book.cover_url
        );
        // Tenta deletar o arquivo, mas não quebra se o arquivo não existir
        try {
          await unlinkAsync(imagePath);
        } catch (fileErr) {
          console.warn(`Arquivo de imagem não encontrado para deletar: ${imagePath}`);
        }
      }

      // Deleta o registro do livro do banco de dados
      await book.destroy();

      return res.status(204).send(); // Resposta de sucesso sem conteúdo
    } catch (err) {
      console.error("Erro ao deletar livro:", err);
      return res.status(500).json({ error: 'Falha ao deletar o resumo.' });
    }
  }
}

module.exports = new AdminController();