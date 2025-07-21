// src/controllers/BookController.js

const Book = require('../models/Book');
const User = require('../models/User');

class BookController {
  // --- MÉTODO STORE SIMPLIFICADO ---
  // A lógica de geração e verificação do slug foi completamente removida daqui.
  // Agora, ele apenas coleta os dados da requisição e manda para o modelo criar o livro.
  // O hook 'beforeCreate' no modelo 'Book.js' cuidará do slug automaticamente.
  async store(req, res) {
    const { title, author, category, summary } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'A imagem de capa é obrigatória ou o tipo de arquivo não é suportado.' });
    }
    
    const { filename } = req.file;
    const submitted_by = req.userId; // Assumindo que este ID vem de um middleware de autenticação

    try {
      // O campo 'slug' não é mais passado aqui.
      // O modelo vai gerá-lo automaticamente antes de salvar.
      const book = await Book.create({
        title,
        author,
        category,
        summary,
        cover_url: filename,
        submitted_by,
        status: 'PENDING',
      });
      
      return res.status(201).json(book);

    } catch (err) {
      console.error('Erro ao criar o livro:', err);
      
      // Um bom tratamento de erro caso algo inesperado aconteça,
      // mesmo que o hook no modelo deva prevenir o erro de duplicidade.
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ error: 'Conflito: Um livro com um título muito similar já existe.' });
      }

      return res.status(500).json({ error: 'Falha ao enviar o resumo.' });
    }
  }

  // --- Os outros métodos permanecem exatamente como estavam ---

  async listMyBooks(req, res) {
    try {
      const books = await Book.findAll({ 
        where: { submitted_by: req.userId }, 
        order: [['createdAt', 'DESC']] 
      });
      return res.json(books);
    } catch (err) {
      console.error('Erro ao buscar "meus livros":', err);
      return res.status(500).json({ error: 'Falha ao buscar seus envios.' });
    }
  }

  async show(req, res) {
    try {
      const { slug } = req.params; 
      const book = await Book.findOne({ 
        where: { slug }, 
        include: { model: User, as: 'submitter', attributes: ['name'] } 
      });
      
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