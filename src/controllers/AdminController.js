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
            // Agora o book retorna full_cover_url que o frontend sabe como resolver
            attributes: ['id', 'title', 'author', 'cover_url', 'slug'] 
          },
          { model: User, as: 'user', attributes: ['name'] }
        ],
        order: [['created_at', 'ASC']],
      });

      // Removida a lógica de manipulação de URL aqui, pois o getter full_cover_url no modelo Book
      // e a lógica do frontend já cuidarão disso.
      // O frontend deve usar summary.book.full_cover_url diretamente.

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

  // ===================================================================
  // ||                  GESTÃO DE CAPAS DE LIVRO                     ||
  // ===================================================================

  /**
   * Atualiza a URL da capa de um livro específico.
   * Recebe o ID do livro e o arquivo de imagem via upload (multer).
   */
  async updateBookCover(req, res) {
    try {
      const { bookId } = req.params;
      const { filename } = req.file; // Multer armazena o nome do arquivo aqui

      const book = await Book.findByPk(bookId);
      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado.' });
      }

      // Atualiza o campo cover_url do livro com o nome do arquivo uploaded
      book.cover_url = filename;
      await book.save();

      return res.status(200).json({ 
        message: 'Capa do livro atualizada com sucesso!',
        book: {
          id: book.id,
          title: book.title,
          cover_url: book.cover_url, // Retorna o nome do arquivo para confirmação
          full_cover_url: book.full_cover_url // Retorna a URL completa para uso no frontend
        }
      });

    } catch (error) {
      console.error("Erro ao atualizar capa do livro:", error);
      // Se houver erro, por exemplo, Multer não conseguir processar o arquivo
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'O arquivo é muito grande.' });
      }
      return res.status(500).json({ error: 'Erro interno ao atualizar a capa do livro.' });
    }
  }

}

module.exports = new AdminController();
