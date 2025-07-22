// src/controllers/ContactController.js
const Message = require('../models/Message');

class ContactController {
  async store(req, res) {
    const { name, email, subject, message } = req.body;

    // Validação simples
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
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