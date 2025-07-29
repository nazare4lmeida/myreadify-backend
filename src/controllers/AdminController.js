const { Book, Summary, Message, User } = require("../models");

class AdminController {
  // ===================================================================
  // ||                     GESTÃO DE RESUMOS                         ||
  // ===================================================================

  /**
   * Lista todos os resumos que estão aguardando aprovação.
   */
  async listPendingSummaries(req, res) {
    try {
      const summaries = await Summary.findAll({
        where: { status: "PENDING" },
        include: [
          {
            model: Book,
            as: "book", // CORREÇÃO AQUI: Inclua 'full_cover_url' nos atributos do livro incluído
            attributes: [
              "id",
              "title",
              "author",
              "cover_url",
              "full_cover_url",
            ],
          },
          { model: User, as: "user", attributes: ["name"] },
        ],
        order: [["created_at", "ASC"]],
      }); // Não é mais necessária a lógica de 'finalCoverUrl' aqui, // pois 'full_cover_url' já virá populado do banco de dados (campo virtual).

      const formattedSummaries = summaries.map((s) => {
        const summaryJson = s.toJSON();
        if (summaryJson.book) {
          // Agora, o frontend deve usar diretamente summaryJson.book.full_cover_url
          // ou um helper que o verifique.
          // Garantindo que cover_url no JSON seja o full_cover_url para simplicidade no frontend
          summaryJson.book.cover_url = summaryJson.book.full_cover_url;
        }
        return summaryJson;
      });

      return res.status(200).json(formattedSummaries);
    } catch (err) {
      console.error("Erro ao buscar resumos pendentes:", err);
      return res
        .status(500)
        .json({ error: "Erro ao buscar resumos pendentes." });
    }
  } // A função listAllSummaries já estava correta.

  async listAllSummaries(req, res) {
    try {
      const summaries = await Summary.findAll({
        include: [
          {
            model: Book,
            as: "book", // CORREÇÃO AQUI: Inclua 'full_cover_url' nos atributos do livro incluído
            attributes: ["id", "title", "full_cover_url"],
          },
          { model: User, as: "user", attributes: ["name"] },
        ],
        order: [["created_at", "DESC"]],
      });
      return res.status(200).json(summaries);
    } catch (err) {
      console.error("Erro ao buscar todos os resumos:", err);
      return res
        .status(500)
        .json({ error: "Erro ao buscar todos os resumos." });
    }
  } // ... restante do código do AdminController ...

  async approveSummary(req, res) {
    try {
      const { summaryId } = req.params;
      const summary = await Summary.findByPk(summaryId);
      if (!summary)
        return res.status(404).json({ error: "Resumo não encontrado." });

      summary.status = "COMPLETED";
      await summary.save();

      if (summary.book_id) {
        await Book.update(
          { status: "COMPLETED" },
          { where: { id: summary.book_id } }
        );
      }

      return res
        .status(200)
        .json({ message: "Resumo e livro aprovados com sucesso!" });
    } catch (error) {
      console.error("Erro ao aprovar resumo:", error);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  }

  async rejectSummary(req, res) {
    const { summaryId } = req.params;
    try {
      const summary = await Summary.findByPk(summaryId);
      if (!summary)
        return res.status(404).json({ error: "Resumo não encontrado." });
      if (summary.status !== "PENDING")
        return res
          .status(400)
          .json({ error: "Apenas resumos pendentes podem ser rejeitados." });
      await summary.destroy();
      return res
        .status(200)
        .json({ message: "Resumo rejeitado e removido com sucesso." });
    } catch (err) {
      console.error("Erro ao rejeitar resumo:", err);
      return res.status(500).json({ error: "Erro ao excluir resumo." });
    }
  } // NOVO: Função para atualizar a capa de um livro (usada pelo AdminApprovalPage)

  async updateBookCover(req, res) {
    const { bookId } = req.params;
    const newCoverFilename = req.file ? req.file.filename : null;

    if (!newCoverFilename) {
      return res
        .status(400)
        .json({ error: "Nenhuma imagem de capa fornecida para atualização." });
    }

    try {
      const book = await Book.findByPk(bookId);
      if (!book) {
        return res.status(404).json({ error: "Livro não encontrado." });
      }

      book.cover_url = newCoverFilename; // Atualiza com o novo nome do arquivo
      await book.save();

      return res.status(200).json({
        message: "Capa do livro atualizada com sucesso!",
        book: {
          id: book.id,
          title: book.title,
          cover_url: book.full_cover_url, // Retorna a URL completa
        },
      });
    } catch (error) {
      console.error("Erro ao atualizar capa do livro:", error);
      return res
        .status(500)
        .json({ error: "Erro ao atualizar capa do livro." });
    }
  }
}

module.exports = new AdminController();
