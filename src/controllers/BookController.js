// src/controllers/BookController.js
const Book = require('../models/Book');
const User = require('../models/User');

class BookController {
  // --- CREATE: Enviar um novo resumo (Rota Protegida) ---
  async store(req, res) {
    const { title, author, category, cover_url, summary } = req.body;
    // O ID do usuário vem do nosso middleware de autenticação
    const submitted_by = req.userId; 

    try {
      const book = await Book.create({
        title,
        author,
        category,
        cover_url,
        summary,
        submitted_by,
        status: 'PENDING', // Todo novo envio começa como pendente
      });

      return res.status(201).json(book);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Falha ao enviar o resumo.' });
    }
  }

  // --- READ (All): Listar todos os resumos APROVADOS (Rota Pública) ---
  async index(req, res) {
    try {
      const books = await Book.findAll({
        where: { status: 'APPROVED' },
        include: { // Inclui os dados do usuário que enviou
          model: User,
          as: 'submitter',
          attributes: ['id', 'name'], // Pega apenas o ID e o nome do usuário
        },
        order: [['created_at', 'DESC']], // Mais recentes primeiro
      });

      return res.json(books);
    } catch (err) {
      return res.status(500).json({ error: 'Não foi possível listar os livros.' });
    }
  }

  // --- READ (One): Ver um resumo específico APROVADO (Rota Pública) ---
  async show(req, res) {
    try {
      const { id } = req.params;
      const book = await Book.findOne({
        where: { id, status: 'APPROVED' },
        include: { model: User, as: 'submitter', attributes: ['id', 'name'] },
      });

      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado ou não aprovado.' });
      }

      return res.json(book);
    } catch (err) {
      return res.status(500).json({ error: 'Falha ao buscar o livro.' });
    }
  }

  async update(req, res) {
  const { id } = req.params;
  // Pegamos os campos que podem ser atualizados do corpo da requisição
  const { title, author, category, summary, cover_url } = req.body;

  try {
    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({ error: 'Livro não encontrado.' });
    }

    // Atualiza o livro com os novos dados
    await book.update({ title, author, category, summary, cover_url });

    return res.json(book); // Retorna o livro com os dados atualizados
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Falha ao atualizar o livro.' });
  }
}

  // --- UPDATE: Aprovar um livro (Rota de Admin) ---
  async approve(req, res) {
    try {
      const { id } = req.params;
      const book = await Book.findByPk(id);

      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado.' });
      }

      book.status = 'APPROVED';
      await book.save();

      return res.json(book);
    } catch (err) {
      return res.status(500).json({ error: 'Falha ao aprovar o livro.' });
    }
  }

  async delete(req, res) {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({ error: 'Livro não encontrado.' });
    }

    await book.destroy();

    // 204 No Content: Resposta padrão para sucesso em requisições de delete sem corpo de resposta.
    return res.status(204).send();

  } catch (err) {
    return res.status(500).json({ error: 'Falha ao deletar o livro.' });
  }
}

}

module.exports = new BookController();