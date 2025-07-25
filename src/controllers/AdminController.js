const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const { Book, User } = require("../models")
const { supabase } = require("../config/supabase"); // Importamos o Supabase

const unlinkAsync = promisify(fs.unlink);

class AdminController {
  async listPending(req, res) {
    try {
      const pendingBooks = await Book.findAll({
        where: { status: "PENDING" },
        order: [["createdAt", "ASC"]],
        include: {
          model: User,
          as: "submitter",
          attributes: ["id", "name"],
        },
      });
      return res.json(pendingBooks);
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Falha ao buscar resumos pendentes." });
    }
  }

  async updateBookStatus(req, res) {
    const { bookId } = req.params;
    const { status } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Status fornecido é inválido." });
    }

    try {
      const book = await Book.findByPk(bookId);
      if (!book) {
        return res.status(404).json({ error: "Resumo não encontrado." });
      }

      book.status = status;
      await book.save();

      return res.json({ books });
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Falha ao atualizar o status do resumo." });
    }
  }

  async updateCoverImage(req, res) {
    const { bookId } = req.params;

    if (!req.file) {
      return res
        .status(400)
        .json({ error: "Nenhum arquivo de imagem foi enviado." });
    }

    try {
      const book = await Book.findByPk(bookId);
      if (!book) {
        return res.status(404).json({ error: "Resumo não encontrado." });
      }

      const file = req.file;
      const fileName = `${Date.now()}-${file.originalname.replace(/\s/g, "_")}`;

      const { error: uploadError } = await supabase.storage
        .from("covers") // Nome do seu bucket
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (uploadError) {
        throw new Error(
          "Falha no upload para o Supabase: " + uploadError.message
        );
      }

      const { data: publicUrlData } = supabase.storage
        .from("covers")
        .getPublicUrl(fileName);

      book.cover_url = publicUrlData.publicUrl;
      await book.save();

      return res.json({ books: book });
    } catch (err) {
      console.error("Erro ao atualizar a capa do livro:", err);
      return res
        .status(500)
        .json({ error: "Falha interna ao atualizar a capa." });
    }
  }

  async listAll(req, res) {
    try {
      const allBooks = await Book.findAll({
        order: [["createdAt", "DESC"]],
        include: { model: User, as: "submitter", attributes: ["name"] },
      });
      return res.json(allBooks);
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Falha ao buscar todos os resumos." });
    }
  }

  async deleteBook(req, res) {
    const { bookId } = req.params;

    try {
      const book = await Book.findByPk(bookId);
      if (!book) {
        return res.status(404).json({ error: "Resumo não encontrado." });
      }

      if (book.cover_url && book.cover_url.includes("supabase")) {
        const fileName = book.cover_url.split("/").pop();
        await supabase.storage.from("covers").remove([fileName]);
      }

      await book.destroy();

      return res.status(204).send();
    } catch (err) {
      console.error("Erro ao deletar livro:", err);
      return res.status(500).json({ error: "Falha ao deletar o resumo." });
    }
  }
}

module.exports = new AdminController();
