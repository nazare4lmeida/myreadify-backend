// 1. Importa a conexão principal
const database = require('../models');
// 2. Pega o model 'Message' de dentro da conexão
const { Message } = database.models;

class ContactController {
  async store(req, res) {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
      // Esta linha agora vai funcionar
      const newMessage = await Message.create({
        name,
        email,
        subject,
        message,
      });

      return res.status(201).json(newMessage);
      
    } catch (error) {
      console.error('Erro ao salvar mensagem:', error);
      return res.status(500).json({ error: 'Ocorreu um erro interno ao processar sua solicitação.' });
    }
  }
}

module.exports = new ContactController();