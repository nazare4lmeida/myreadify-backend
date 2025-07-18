// src/controllers/BookController.js

const Book = require('../models/Book');
const User = require('../models/User');

class BookController {
  async store(req, res) {
    const { title, author, category, summary } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'A imagem de capa é obrigatória ou o tipo de arquivo não é suportado.' });
    }

    const { filename } = req.file;
    const submitted_by = req.userId;

    try {
      const book = await Book.create({
        title,
        author,
        category,
        cover_url: filename,
        summary,
        submitted_by,
        status: 'PENDING',
      });
      return res.status(201).json(book);
    } catch (err) {
      console.error('Erro ao criar o livro:', err);
      return res.status(500).json({ error: 'Falha ao enviar o resumo.' });
    }
  }

  async listMyBooks(req, res) {
    try {
      const books = await Book.findAll({
        where: { submitted_by: req.userId },
        order: [['createdAt', 'DESC']],
      });
      return res.json(books);
    } catch (err) {
      console.error('Erro ao buscar "meus livros":', err);
      return res.status(500).json({ error: 'Falha ao buscar seus envios.' });
    }
  }

  async index(req, res) {
    try {
      const books = await Book.findAll({
        where: { status: 'APPROVED' },
        order: [['createdAt', 'DESC']],
      });
      return res.json(books);
    } catch (err) {
      return res.status(500).json({ error: 'Falha ao buscar os livros.' });
    }
  }

  async show(req, res) {
    try {
      const { slug } = req.params; 
      const book = await Book.findOne({
        where: { slug },
        include: {
          model: User,
          as: 'submitter',
          attributes: ['name'],
        }
      });

      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado.' });
      }
      
      if (book.status !== 'APPROVED') {
        return res.status(404).json({ error: 'Livro não encontrado ou não aprovado.' });
      }

      return res.json(book);
    } catch (err) {
      return res.status(500).json({ error: 'Falha ao buscar detalhes do livro.' });
    }
  }
}

module.exports = new BookController();