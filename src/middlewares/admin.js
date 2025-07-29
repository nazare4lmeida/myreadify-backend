// middlewares/admin.js

const { User } = require('../models');

module.exports = async (req, res, next) => {
  // Este middleware depende do authMiddleware para popular req.userId.
  // Se o authMiddleware não rodar ou o token for inválido, req.userId não existirá.
  if (!req.userId) {
    return res.status(401).json({ error: 'Falha na autenticação. ID do usuário não encontrado.' });
  }

  try {
    const user = await User.findByPk(req.userId);

    if (!user || user.role !== 'admin') { // Verifica se o usuário existe e se tem a role 'admin'
      return res.status(403).json({ error: 'Acesso negado. Requer permissão de administrador.' });
    }

    req.user = user; // Opcional: Anexar o objeto User completo na requisição
    return next();

  } catch (err) {
    console.error("Erro interno ao verificar permissões de administrador:", err);
    return res.status(500).json({ error: 'Erro interno ao verificar permissões de administrador.' });
  }
};
