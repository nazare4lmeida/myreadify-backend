const database = require("../models");

const { Message } = database;
const nodemailer = require("nodemailer");

class MessageController {
  async index(req, res) {
    try {
      const messages = await Message.findAll({
        order: [["created_at", "DESC"]],
      });
      return res.json(messages);
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }

  async destroy(req, res) {
    const { messageId } = req.params;
    try {
      const message = await Message.findByPk(messageId);
      if (!message) {
        return res.status(404).json({ error: "Mensagem não encontrada." });
      }
      await message.destroy();
      return res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar mensagem:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }

  async reply(req, res) {
    const { messageId } = req.params;
    const { replyText } = req.body;

    try {
      const originalMessage = await Message.findByPk(messageId);
      if (!originalMessage) {
        return res
          .status(404)
          .json({ error: "Mensagem original não encontrada." });
      }

      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"MyReadify" <${process.env.MAIL_USER}>`,
        to: originalMessage.email,
        subject: `Re: ${originalMessage.subject}`,
        html: `
          <p>Olá ${originalMessage.name},</p>
          <p>Em resposta à sua mensagem:</p>
          <p><i>"${originalMessage.message}"</i></p>
          <hr>
          <p>${replyText.replace(/\n/g, "<br>")}</p>
          <br>
          <p>Atenciosamente,</p>
          <p>Equipe MyReadify</p>
        `,
      });

      originalMessage.is_read = true;
      await originalMessage.save();

      return res.status(200).json({ message: "Resposta enviada com sucesso!" });
    } catch (error) {
      console.error("Erro ao enviar email de resposta:", error);
      return res.status(500).json({ error: "Falha ao enviar a resposta." });
    }
  }
}

module.exports = new MessageController();
