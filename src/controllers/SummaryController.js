// >>> CORREÇÃO 1: Importamos 'Book' e 'User' diretamente do 'models' <<<
const { Summary, Book, User } = require('../models');

class SummaryController {
  // Sua função 'index' que lista todos os resumos aprovados
  async index(req, res) {
    try {
      const summaries = await Summary.findAll({
        where: { status: 'COMPLETED' },
        attributes: [
          'id',
          'title',
          'author',
          'category',
          'summary_text',
          'cover_url',
        ],
        order: [['createdAt', 'DESC']], // Corrigido para camelCase
      });
      return res.status(200).json(summaries);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar resumos.' });
    }
  }

  // Sua função 'store' para enviar um novo resumo
  async store(req, res) {
    const { title, author, category, summary_text } = req.body;
    const coverImage = req.file ? req.file.filename : null;
    try {
      const summary = await Summary.create({
        title,
        author,
        category,
        summary_text,
        cover_url: coverImage,
        status: 'PENDING',
        user_id: req.userId, // Adicionado para associar ao usuário
      });
      return res.status(201).json(summary);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao cadastrar resumo.' });
    }
  }

  // A função que estávamos corrigindo
  async getMySummaries(req, res) {
    try {
      const summaries = await Summary.findAll({
        where: { user_id: req.userId },
        include: [
          {
            // >>> CORREÇÃO 2: Usamos 'Book' diretamente, sem 'database.' <<<
            model: Book,
            as: 'book',
            attributes: ['title', 'author'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      // A formatação dos dados para o frontend
      const formattedSummaries = summaries.map(s => ({
        id: s.id,
        title: s.book ? s.book.title : 'Título não encontrado',
        author: s.book ? s.book.author : 'Autor desconhecido',
        status: s.status,
      }));

      return res.status(200).json(formattedSummaries);
    } catch (error) {
      console.error("Erro ao buscar 'meus resumos':", error);
      return res.status(500).json({ error: "Erro ao buscar seus envios." });
    }
  }
}

module.exports = new SummaryController();