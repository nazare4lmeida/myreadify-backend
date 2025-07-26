const { Summary } = require('../models');

class SummaryController {
  // Lista todos os resumos com status APROVADO
  async index(req, res) {
    try {
      const summaries = await Summary.findAll({
        where: { status: 'APPROVED' },
        attributes: [
          'id',
          'title',
          'author',
          'category',
          'summary_text',
          'cover_path',
        ],
        order: [['createdAt', 'DESC']],
      });

      return res.status(200).json(summaries);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar resumos.' });
    }
  }

  // Envia um novo resumo completo (pendente de aprovação)
  async store(req, res) {
    const { title, author, category, summary_text } = req.body;
    const coverImage = req.file ? req.file.filename : null;

    try {
      const summary = await Summary.create({
        title,
        author,
        category,
        summary_text,
        cover_path: coverImage,
        status: 'PENDING',
      });

      return res.status(201).json(summary);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao cadastrar resumo.' });
    }
  }
}

module.exports = new SummaryController();
