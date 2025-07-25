const { Book, Summary, User } = require("../models").models;
const slugify = require("slugify");
const { supabase } = require("../config/supabase");

class BookController {
  async store(req, res) {
    const { title, author, category, summary } = req.body;
    const submitted_by = req.userId;
    let coverUrlForDatabase;

    if (!req.file) {
      return res.status(400).json({
        error: "A imagem de capa é obrigatória ou o tipo de arquivo não é suportado.",
      });
    }

    try {
      if (process.env.NODE_ENV === "production") {
        const file = req.file;
        const fileName = `${Date.now()}-${file.originalname}`;

        const { error } = await supabase.storage
          .from("covers")
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
          });

        if (error) {
          throw new Error("Falha no upload para o Supabase: " + error.message);
        }

        const { data } = supabase.storage
          .from("covers")
          .getPublicUrl(fileName);

        coverUrlForDatabase = data.publicUrl;
      } else {
        coverUrlForDatabase = req.file.filename;
      }

      const slug = slugify(title, { lower: true });

      const summaryCreated = await Summary.create({
        title,
        author,
        category,
        content: summary,
        cover_url: coverUrlForDatabase,
        submitted_by,
        status: "PENDING",
        slug,
      });

      return res.status(201).json(summaryCreated);
    } catch (err) {
      console.error("Erro ao criar resumo:", err);
      return res.status(500).json({ error: "Falha ao enviar o resumo." });
    }
  }

  async update(req, res) {
    const { slug } = req.params;
    const { summary } = req.body;
    const submitted_by = req.userId;

    if (!summary) {
      return res.status(400).json({ error: "O conteúdo do resumo é obrigatório." });
    }

    try {
      const book = await Book.findOne({ where: { slug } });

      if (!book) {
        return res.status(404).json({ error: "Livro não encontrado." });
      }

      book.summary = summary;
      book.submitted_by = submitted_by;
      book.status = "PENDING";

      await book.save();

      return res.json({ books });
    } catch (err) {
      console.error("Erro ao atualizar o livro:", err);
      return res.status(500).json({ error: "Falha ao atualizar o resumo." });
    }
  }

  async listMyBooks(req, res) {
    try {
      const summaries = await Summary.findAll({
        where: { submitted_by: req.userId },
        order: [["created_at", "DESC"]],
      });
      return res.json(summaries);
    } catch (err) {
      console.error('Erro ao buscar "meus resumos":', err);
      return res.status(500).json({ error: "Falha ao buscar seus resumos." });
    }
  }

  async show(req, res) {
    try {
      const { slug } = req.params;
      const summary = await Summary.findOne({
        where: { slug, status: "APPROVED" },
        include: { model: User, as: "submitter", attributes: ["name"] },
      });
      if (!summary) {
        return res
          .status(404)
          .json({ error: "Resumo não encontrado ou não aprovado." });
      }
      return res.json(summary);
    } catch (err) {
      return res.status(500).json({ error: "Falha ao buscar detalhes do resumo." });
    }
  }

  async index(req, res) {
    try {
      const summaries = await Summary.findAll({
        where: { status: "APPROVED" },
        order: [["created_at", "DESC"]],
      });
      return res.json(summaries);
    } catch (err) {
      console.error("Erro ao buscar resumos aprovados:", err);
      return res.status(500).json({ error: "Falha ao buscar os resumos." });
    }
  }
}

module.exports = new BookController();
