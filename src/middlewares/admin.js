// middlewares/admin.js (VERSÃO CORRETA E PADRÃO)

const { User } = require('../models');

module.exports = async (req, res, next) => {
  // Neste ponto, o 'authMiddleware' já rodou e verificou o token.
  // Ele também nos deu o 'req.userId'.
  
  if (!req.userId) {
    return res.status(401).json({ error: 'Falha na autenticação. ID do usuário não encontrado.' });
  }

  try {
    // Usamos o ID do usuário (que veio do token decodificado) para buscar suas informações
    const user = await User.findByPk(req.userId);

    // Verificamos se o usuário realmente existe e se o cargo dele é 'admin'
    if (!user || user.role !== 'admin') {
      // Se não for admin, negamos o acesso com 403 Forbidden
      return res.status(403).json({ error: 'Acesso negado. Requer permissão de administrador.' });
    }

    // Se tudo estiver certo, anexa os dados do usuário admin na requisição e prossegue
    req.user = user;
    return next();

  } catch (err) {
    return res.status(500).json({ error: 'Erro interno ao verificar permissões de administrador.' });
  }
};