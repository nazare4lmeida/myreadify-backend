const { Book, Summary, Message, User } = require('../models');

class AdminController {

  // ===================================================================
  // ||                     GESTÃO DE RESUMOS                         ||
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
            attributes: ['id', 'title', 'author', 'cover_url'] 
          },
          { model: User, as: 'user', attributes: ['name'] }
        ],
        order: [['created_at', 'ASC']],
      });

      // <<< A CORREÇÃO FINAL ESTÁ AQUI (IDÊNTICA À QUE FUNCIONOU ANTES) >>>
      // Aplicamos a mesma lógica inteligente para resolver a URL da imagem.
      const formattedSummaries = summaries.map(s => {
        const summaryJson = s.toJSON();
        
        if (summaryJson.book) {
          const finalCoverUrl = s.book.cover_url && s.book.cover_url.startsWith('/src/assets') 
            ? s.book.cover_url      // Usa o caminho do mock diretamente
            : s.book.full_cover_url;  // Usa o getter para a imagem da API/upload

          summaryJson.book.cover_url = finalCoverUrl;
        }
        return summaryJson;
      });

      return res.status(200).json(formattedSummaries);
    } catch (err) {
      console.error("Erro ao buscar resumos pendentes:", err);
      return res.status(500).json({ error: 'Erro ao buscar resumos pendentes.' });
    }
  }

  // A função listAllSummaries já estava correta.
  async listAllSummaries(req, res) {
    try {
      const summaries = await Summary.findAll({
        include: [
          { model: Book, as: 'book', attributes: ['id', 'title'] },
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

  // A função de aprovação já está correta.
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

  // A função de rejeição e as outras funções de admin já estão corretas.
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
}

module.exports = new AdminController();