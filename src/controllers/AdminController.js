const { Book, Summary, Message, User } = require('../models');

class AdminController {

  // ===================================================================
  // ||                       GESTÃO DE RESUMOS                       ||
  // ===================================================================

  /**
   * Lista todos os resumos que estão aguardando aprovação.
   */
  async listPendingSummaries(req, res) {
    try {
      const summaries = await Summary.findAll({ 
        where: { status: 'PENDING' },
        include: [
          { 
            model: Book, 
            as: 'book', 
            // Incluir o campo virtual 'full_cover_url'
            attributes: ['id', 'title', 'author', 'cover_url', 'full_cover_url'] 
          },
          { model: User, as: 'user', attributes: ['name'] }
        ],
        order: [['created_at', 'ASC']],
      });

      // O frontend usará summary.book.full_cover_url diretamente.
      return res.status(200).json(summaries);
    } catch (err) {
      console.error("Erro ao buscar resumos pendentes:", err);
      return res.status(500).json({ error: 'Erro ao buscar resumos pendentes.' });
    }
  }

  async listAllSummaries(req, res) {
    try {
      const summaries = await Summary.findAll({
        include: [
          { 
            model: Book, 
            as: 'book', 
            // Incluir o campo virtual 'full_cover_url'
            attributes: ['id', 'title', 'cover_url', 'full_cover_url'] 
          },
          { model: User, as: 'user', attributes: ['name'] }
        ],
        order: [['created_at', 'DESC']],
      });
      return res.status(200).json(summaries);
    } catch (err) {
      console.error("Erro ao buscar todos os resumos:", err);
      return res.status(500).json({ error: 'Erro ao buscar todos os resumos.' });
    }
  }

  async approveSummary(req, res) {
    try {
      const { summaryId } = req.params;
      const summary = await Summary.findByPk(summaryId);
      if (!summary) return res.status(404).json({ error: "Resumo não encontrado." });

      summary.status = 'COMPLETED';
      await summary.save();

      if (summary.book_id) {
        await Book.update({ status: 'COMPLETED' }, { where: { id: summary.book_id } });
      }

      return res.status(200).json({ message: "Resumo e livro aprovados com sucesso!" });
    } catch (error) {
      console.error("Erro ao aprovar resumo:", error);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  }

  async rejectSummary(req, res) {
    const { summaryId } = req.params;
    try {
      const summary = await Summary.findByPk(summaryId);
      if (!summary) return res.status(404).json({ error: 'Resumo não encontrado.' });
      if (summary.status !== 'PENDING') return res.status(400).json({ error: 'Apenas resumos pendentes podem ser rejeitados.' });
      
      await summary.destroy();
      return res.status(200).json({ message: 'Resumo rejeitado e removido com sucesso.' });
    } catch (err) {
      console.error("Erro ao rejeitar resumo:", err);
      return res.status(500).json({ error: 'Erro ao excluir resumo.' });
    }
  }

  // NOVO MÉTODO: Para o Admin poder atualizar a capa de um livro
  async updateBookCover(req, res) {
    const { bookId } = req.params;
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo de imagem enviado." });
    }
    try {
      const book = await Book.findByPk(bookId);
      if (!book) {
        return res.status(404).json({ error: "Livro não encontrado." });
      }
      // Salva apenas o nome do arquivo, como o Multer o salvou
      book.cover_url = req.file.filename;
      await book.save();
      return res.status(200).json({ message: "Capa do livro atualizada com sucesso!", cover_url: book.full_cover_url });
    } catch (error) {
      console.error("Erro ao atualizar capa do livro:", error);
      return res.status(500).json({ error: "Erro interno ao atualizar a capa do livro." });
    }
  }
}

module.exports = new AdminController();
