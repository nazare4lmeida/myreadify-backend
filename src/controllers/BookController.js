// src/controllers/BookController.js

const Book = require('../models/Book');
const User = require('../models/User');
const slugify = require('slugify'); // Assumindo que você usa slugify

// ... (sua função generateSlug, se existir)

class BookController {
  // --- MÉTODO UPDATE (NOVO) ---
  // Este método será usado para atualizar um livro existente com um resumo.
  async update(req, res) {
    const { slug } = req.params; // Pega o slug da URL
    const { summary } = req.body; // Pega o novo resumo do corpo da requisição
    const submitted_by = req.userId; // Pega o ID do usuário logado

    // Validação simples
    if (!summary) {
      return res.status(400).json({ error: 'O conteúdo do resumo é obrigatório.' });
    }

    try {
      const book = await Book.findOne({ where: { slug } });

      // Verifica se o livro existe
      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado.' });
      }
      
      // Atualiza os campos do livro
      book.summary = summary;
      book.submitted_by = submitted_by;
      book.status = 'PENDING'; // O resumo entra para aprovação

      await book.save(); // Salva as alterações no banco de dados

      return res.json(book); // Retorna o livro atualizado
    } catch (err) {
      console.error('Erro ao atualizar o livro:', err);
      return res.status(500).json({ error: 'Falha ao atualizar o resumo.' });
    }
  }

  // --- O resto dos seus métodos (store, listMyBooks, etc.) permanecem iguais ---
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
    } catch (err) {
      console.error('Erro ao buscar "meus livros":', err);
      return res.status(500).json({ error: 'Falha ao buscar seus envios.' });
    }
  }

  async show(req, res) {
    try {
      const { slug: bookSlug } = req.params; // Renomeado para evitar conflito
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
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 12;
      const offset = (page - 1) * limit;

      const { count, rows: books } = await Book.findAndCountAll({
        where: { status: 'APPROVED' },
        order: [['title', 'ASC']],
        limit,
        offset,
      });

      const totalPages = Math.ceil(count / limit);

      return res.json({
        books,
        currentPage: page,
        totalPages,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Falha ao buscar os livros.' });
    }
  }
}

module.exports = new BookController();