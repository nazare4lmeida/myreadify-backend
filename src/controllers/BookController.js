const { Book } = require('../models');

class BookController {
  async index(req, res) {
    try {
      const books = await Book.findAll({
        where: { status: 'APPROVED' },
        attributes: ['id', 'title', 'author', 'category', 'cover_path'],
        order: [['createdAt', 'DESC']],
      });

      return res.status(200).json(books);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar livros.' });
    }
  }

  async show(req, res) {
    try {
      const { bookId } = req.params;
      // buscar o livro no banco ou mockado
      return res.status(200).json({ message: `Livro com ID ${bookId}` });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar livro" });
    }
  }
}

module.exports = new BookController();
