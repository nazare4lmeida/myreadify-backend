// src/controllers/SummaryController.js

const { Summary, Book } = require('../models'); // Não precisa do User aqui

class SummaryController {
  // Sua função 'index' (sem alterações)
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
        order: [['createdAt', 'DESC']],
      });
      return res.status(200).json(summaries);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar resumos.' });
    }
  }

  // Sua função 'store' (sem alterações)
  async store(req, res) {
  // O frontend deve enviar 'title', 'author', etc., para o novo livro
  // E também o 'summaryContent' para o texto do resumo.
  const { title, author, category, summaryContent, slug } = req.body;
  const coverImage = req.file ? req.file.filename : null;

  try {
    // Aqui está a correção:
    // Nós salvamos o texto do resumo no campo 'content'.
    // E os outros campos (title, author) são salvos em suas próprias colunas.
    const summary = await Summary.create({
      title, // Para os livros criados do zero
      author, // Para os livros criados do zero
      category, // Para os livros criados do zero
      content: summaryContent, // <<< CORREÇÃO PRINCIPAL: O texto do resumo vai aqui
      slug: slug || slugify(title, { lower: true }), // Usa o slug enviado ou cria um novo
      cover_url: coverImage,
      status: 'PENDING', // O novo campo status!
      user_id: req.userId,
    });
    return res.status(201).json(summary);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao cadastrar resumo.' });
  }
}

  // >>> INÍCIO DA CORREÇÃO <<<
  async getMySummaries(req, res) {
  try {
    const summaries = await Summary.findAll({
      where: { user_id: req.userId },
      include: [
        {
          model: Book,
          as: 'book',
          attributes: ['title', 'author', 'slug', 'cover_url'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // 1. A variável é criada e preenchida aqui
    const formattedSummaries = summaries.map(s => {
      if (!s.book) {
        return null;
      }
      
      return {
        id: s.id,
        status: s.status,
        title: s.book.title,
        author: s.book.author,
        books: {
          slug: s.book.slug,
          cover_url: s.book.cover_url,
        }
      };
    }).filter(s => s !== null);

    // 2. A variável já existe e agora é usada para enviar a resposta
    return res.status(200).json(formattedSummaries);

  } catch (error) {
    // Em caso de erro, esta parte será executada
    console.error("Erro ao buscar 'meus resumos':", error);
    return res.status(500).json({ error: "Erro ao buscar seus envios." });
  }
}
  // >>> FIM DA CORREÇÃO <<<
}

module.exports = new SummaryController();