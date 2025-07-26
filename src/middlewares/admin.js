require('dotenv').config();
const { User } = require('../models');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const emailHeader = req.headers['x-user-email']; // Custom header com o e-mail do usuário

  // Verifica a chave secreta no header
  if (!authHeader || authHeader !== `Bearer ${process.env.APP_SECRET}`) {
    return res.status(401).json({ error: 'Acesso não autorizado. Token inválido.' });
  }

  if (!emailHeader) {
    return res.status(400).json({ error: 'E-mail do usuário não fornecido no header.' });
  }

  try {
    const user = await User.findOne({ where: { email: emailHeader } });

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Acesso negado. Requer permissão de administrador.' });
    }

    return next();
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao verificar permissões de administrador.' });
  }
};
