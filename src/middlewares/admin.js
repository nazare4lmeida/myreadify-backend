// middlewares/admin.js

// Este middleware depende do authMiddleware para popular req.userId.
// Como estamos removendo o token temporariamente, este middleware não será funcional.
// Para testar, você deve REMOVER AS CHAMADAS a este middleware em suas rotas (ex: adminRoutes.js).
// Se quiser, pode comentar a lógica interna para evitar erros caso seja acidentalmente chamado,
// mas o ideal é não o chamar em nenhuma rota neste período sem autenticação.

/*
const { User } = require('../models');

module.exports = async (req, res, next) => {
  if (!req.userId) {
    // Se não há req.userId (porque authMiddleware não rodou ou não há token),
    // isso já seria um problema.
    return res.status(401).json({ error: 'Falha na autenticação. ID do usuário não encontrado.' });
  }

  try {
    const user = await User.findByPk(req.userId);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Requer permissão de administrador.' });
    }

    req.user = user;
    return next();

  } catch (err) {
    return res.status(500).json({ error: 'Erro interno ao verificar permissões de administrador.' });
  }
};
*/

// Para o propósito deste teste sem token, se você mantiver este arquivo,
// certifique-se de que NENHUMA ROTA o esteja usando.
module.exports = (req, res, next) => {
  console.warn("AVISO: O middleware de admin está desativado temporariamente (sem token).");
  // Permite que todas as requisições passem para rotas que o chamem,
  // mas as rotas de admin *não terão proteção*.
  // Para rotas de admin, é MELHOR REMOVER a chamada a este middleware delas.
  next();
};

