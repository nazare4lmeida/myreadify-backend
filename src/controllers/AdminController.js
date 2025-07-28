// src/controllers/AdminController.js (VERSÃO FINAL COMPLETA E CORRIGIDA)

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
            // <<< CORREÇÃO PRINCIPAL: Pedimos a coluna REAL ('cover_url') >>>
            attributes: ['id', 'title', 'author', 'cover_url'] 
          },
          { model: User, as: 'user', attributes: ['name'] }
        ],
        order: [['created_at', 'ASC']],
      });

      // Formata a resposta para usar o GETTER e criar a URL completa
      const formattedSummaries = summaries.map(s => {
        const summaryJson = s.toJSON(); // Converte para um objeto simples
        
        // Se o resumo tem um livro associado, usa o getter para criar a URL
        if (summaryJson.book) {
            // Pega a URL do getter e a coloca no objeto que será enviado ao frontend
            summaryJson.book.cover_url = s.book.full_cover_url;
        }
        return summaryJson;
      });

      return res.status(200).json(formattedSummaries);
    } catch (err) {
      console.error("Erro ao buscar resumos pendentes:", err);
      return res.status(500).json({ error: 'Erro ao buscar resumos pendentes.' });
    }
  }

  // A função listAllSummaries já estava correta, mas a mantemos aqui para consistência.
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

  // A função de aprovação já está correta e não precisa de alterações.
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

  async updateCoverImage(req, res) {
    const { bookId } = req.params;
    try {
      const book = await Book.findByPk(bookId);
      if (!book) return res.status(404).json({ error: 'Livro não encontrado.' });
      
      // Opcional: deletar a imagem antiga
      if (book.cover_url) {
        // a lógica para deletar o arquivo antigo iria aqui...
      }

      book.cover_url = req.file.filename;
      await book.save();

      return res.status(200).json({ message: 'Capa atualizada com sucesso.' });
    } catch (err) {
      console.error("Erro ao atualizar capa:", err);
      return res.status(500).json({ error: 'Erro ao atualizar capa do livro.' });
    }
  }

  // A função de rejeição já está correta e não precisa de alterações.
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