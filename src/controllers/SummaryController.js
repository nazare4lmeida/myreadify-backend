const { Summary, Book } = require("../models"); // Não precisa do User aqui
const slugify = require("slugify");
class SummaryController {
  // Sua função 'index' (sem alterações)
  async index(req, res) {
    try {
      const summaries = await Summary.findAll({
        where: { status: "COMPLETED" },
        attributes: [
          "id",
          "title",
          "author",
          "category",
          "content",
          "cover_url",
        ],
        order: [["createdAt", "DESC"]],
      });
      return res.status(200).json(summaries);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar resumos." });
    }
  }

  // Sua função 'store' (sem alterações)
  async store(req, res) {
  // 1. Pegar todos os dados que podem vir do frontend
  const { title, author, category, content, slug: providedSlug } = req.body;
  const coverImage = req.file ? req.file.filename : null;

  try {
    // 2. Determinar qual slug usar: o que veio do frontend ou um novo criado a partir do título
    const bookSlug = providedSlug || slugify(title, { lower: true, strict: true });

    // Se não tivermos nem um slug fornecido nem um título para criar um, é um erro.
    if (!bookSlug) {
      return res.status(400).json({ error: "É necessário fornecer um slug (para livros existentes) ou um título (para livros novos)." });
    }

    // 3. Encontrar um livro pelo SLUG ou criar um novo se não existir.
    const [book] = await Book.findOrCreate({
      where: { slug: bookSlug }, // <<< A GRANDE MUDANÇA É AQUI
      defaults: {
        // 'defaults' só é usado se o livro for CRIADO
        title: title,
        author: author,
        category: category,
        cover_url: coverImage,
        slug: bookSlug,
      }
    });

    // 4. Criar o resumo, passando o ID do livro encontrado/criado.
    //    O book_id continua sendo a chave estrangeira correta.
    const summary = await Summary.create({
      content: content,
      status: "PENDING",
      user_id: req.userId,
      book_id: book.id, // <-- Usamos o ID aqui para a relação no banco
    });

    return res.status(201).json(summary);

  } catch (error) {
    console.error("ERRO DETALHADO:", error);
    return res.status(500).json({ error: "Erro ao cadastrar resumo." });
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
          as: "book",
          // <<< ESTA É A CORREÇÃO! >>>
          // Pedimos a coluna REAL do banco de dados ('cover_url'),
          // não o campo virtual ('full_cover_url').
          attributes: ["title", "author", "slug", "cover_url"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // O resto do código funciona perfeitamente, sem alterações!
    const formattedSummaries = summaries
      .map((s) => {
        if (!s.book) return null;

        return {
          id: s.id,
          status: s.status,
          title: s.book.title,
          author: s.book.author,
          slug: s.book.slug,
          // Aqui, usamos o campo virtual. O getter do modelo Book será
          // ativado automaticamente para criar esta propriedade para nós!
          cover_url: s.book.full_cover_url,
        };
      })
      .filter((s) => s !== null);

    return res.status(200).json(formattedSummaries);
  } catch (error) {
    console.error("Erro ao buscar 'meus resumos':", error);
    return res.status(500).json({ error: "Erro ao buscar seus envios." });
  }
}
  // >>> FIM DA CORREÇÃO <<<
}

module.exports = new SummaryController();
