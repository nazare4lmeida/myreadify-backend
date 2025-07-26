const { Book } = require('../models');

class BookController {
  async index(req, res) {
    try {
      const books = await Book.findAll({
        where: { status: 'COMPLETED' }, // ou "COMPLETED", dependendo do valor correto
        order: [['created_at', 'DESC']],
        attributes: ['id', 'title', 'author', 'category', 'cover_url'], // <- Corrigido aqui
      });

      return res.json(books);
    } catch (error) {
      console.error('🔥 ERRO AO BUSCAR LIVROS:');
      console.error('NOME:', error.name);
      console.error('MENSAGEM:', error.message);
      console.error('STACK:', error.stack);

      return res.status(500).json({ error: 'Erro ao buscar livros.' });
    }
  }
  

  async show(req, res) {
    try {
      const { bookId } = req.params;

      return res.status(200).json({ message: `Livro com ID ${bookId}` });
    } catch (error) {
      console.error('🔥 ERRO AO BUSCAR LIVRO POR ID:');
      console.error('NOME:', error.name);
      console.error('MENSAGEM:', error.message);
      console.error('STACK:', error.stack);

      return res.status(500).json({ error: 'Erro ao buscar livro' });
    }
  }
}

module.exports = new BookController();
