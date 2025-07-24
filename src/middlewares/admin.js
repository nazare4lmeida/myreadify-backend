// CORREÇÃO: Importa o model 'User' da forma correta
const { User } = require('../models').models;

module.exports = async (req, res, next) => {
  try {
    // Esta linha agora funcionará corretamente
    const user = await User.findByPk(req.userId);

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Acesso negado. Requer permissão de administrador.' });
    }

    return next();

  } catch (err) {
    return res.status(500).json({ error: 'Erro ao verificar permissões de administrador.' });
  }
};