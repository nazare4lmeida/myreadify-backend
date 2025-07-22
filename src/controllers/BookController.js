// src/controllers/BookController.js - VERSÃO COMPLETA E CORRIGIDA

const Book = require('../models/Book');
const User = require('../models/User');
const slugify = require('slugify');

class BookController {
  // --- MÉTODO UPDATE ---
  async update(req, res) {
    const { slug } = req.params;
    const { summary } = req.body;
    const submitted_by = req.userId;

    if (!summary) {
      return res.status(400).json({ error: 'O conteúdo do resumo é obrigatório.' });
    }

    try {
      const book = await Book.findOne({ where: { slug } });

      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado.' });
      }
      
      book.summary = summary;
      book.submitted_by = submitted_by;
      book.status = 'PENDING';

      await book.save();

      return res.json(book);
    } catch (err) {
      console.error('Erro ao atualizar o livro:', err);
      return res.status(500).json({ error: 'Falha ao atualizar o resumo.' });
    }
  }

  // --- O resto dos seus métodos permanecem iguais ---
  async store(req, res) {
    const { title, author, category, summary } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'A imagem de capa é obrigatória ou o tipo de arquivo não é suportado.' });
    }
    const { filename } = req.file;
    const submitted_by = req.userId;
    try {
      const book = await Book.create({
        title, author, category, summary, cover_url: filename, submitted_by, status: 'PENDING',
      });
      return res.status(201).json(book);
    } catch (err) {
      console.error('Erro ao criar o livro:', err);
      return res.status(500).json({ error: 'Falha ao enviar o resumo.' });
    }
  }

  async listMyBooks(req, res) {
    try {
      const books = await Book.findAll({ where: { submitted_by: req.userId }, order: [['createdAt', 'DESC']] });
      return res.json(books);
    } catch (err)
 {
      console.error('Erro ao buscar "meus livros":', err);
      return res.status(500).json({ error: 'Falha ao buscar seus envios.' });
    }
  }

  async show(req, res) {
    try {
      const { slug: bookSlug } = req.params;
      const book = await Book.findOne({ where: { slug: bookSlug }, include: { model: User, as: 'submitter', attributes: ['name'] } });
      if (!book || book.status !== 'APPROVED') {
        return res.status(404).json({ error: 'Livro não encontrado ou não aprovado.' });
      }
      return res.json(book);
    } catch (err) {
      return res.status(500).json({ error: 'Falha ao buscar detalhes do livro.' });
    }
  }

  async index(req, res) {
  try {
    const books = await Book.findAll({
      where: { status: 'APPROVED' },
      order: [['title', 'ASC']],
    });

    return res.json({ books }); // <<< AQUI: retorna como objeto
  } catch (err) {
    console.error("ERRO DETALHADO AO BUSCAR LIVROS:", err);
    return res.status(500).json({ error: 'Falha ao buscar os livros.' });
  }
}
}

module.exports = new BookController();