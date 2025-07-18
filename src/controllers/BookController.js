const Book = require('../models/Book');

class BookController {
  /**
   * store: Método para um usuário autenticado enviar um novo livro.
   * O livro é salvo com status 'PENDING' e o ID do usuário.
   */
  async store(req, res) {
    const { title, author, category, summary } = req.body;
    // Validação para garantir que o arquivo foi enviado
    if (!req.file) {
      return res.status(400).json({ error: 'A imagem de capa é obrigatória.' });
    }
    const { filename: cover_path } = req.file; // Pega o nome do arquivo do multer
    const submitted_by = req.userId; // Pega o ID do usuário do middleware de autenticação

    try {
      const book = await Book.create({
        title,
        author,
        category,
        cover_path, // Salva o caminho do arquivo no banco de dados
        summary,
        submitted_by,
        status: 'PENDING', // Status inicial é sempre pendente
      });
      return res.status(201).json(book);
    } catch (err) {
      console.error('Erro ao criar o livro:', err);
      return res.status(500).json({ error: 'Falha ao enviar o resumo.' });
    }
  }

  /**
   * listMyBooks: Lista todos os livros enviados pelo usuário logado.
   */
  async listMyBooks(req, res) {
    try {
      const books = await Book.findAll({
        where: { submitted_by: req.userId },
        order: [['created_at', 'DESC']],
      });
      return res.json(books);
    } catch (err) {
      console.error('Erro ao buscar "meus livros":', err);
      return res.status(500).json({ error: 'Falha ao buscar seus envios.' });
    }
  }

  // --- Métodos Públicos (não precisam de autenticação) ---

  /**
   * index: Lista todos os livros com status 'APPROVED' para o público geral.
   */
  async index(req, res) {
    try {
      const books = await Book.findAll({
        where: { status: 'APPROVED' },
        order: [['title', 'ASC']],
      });
      return res.json(books);
    } catch (err) {
      return res.status(500).json({ error: 'Falha ao buscar os livros.' });
    }
  }

  /**
   * show: Exibe os detalhes de um livro específico que esteja 'APPROVED'.
   */
  async show(req, res) {
    try {
      const { id } = req.params;
      const book = await Book.findOne({
        where: { id, status: 'APPROVED' },
      });

      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado ou não aprovado.' });
      }

      return res.json(book);
    } catch (err) {
      return res.status(500).json({ error: 'Falha ao buscar detalhes do livro.' });
    }
  }


  // --- Métodos de Admin (requerem autenticação e permissão de admin) ---

  async update(req, res) {
    return res.status(501).json({ message: 'Funcionalidade de update ainda não implementada.' });
  }

  async delete(req, res) {
     return res.status(501).json({ message: 'Funcionalidade de delete ainda não implementada.' });
  }

  async approve(req, res) {
    return res.status(501).json({ message: 'Funcionalidade de aprovação ainda não implementada.' });
  }
}

module.exports = new BookController();
