// src/middlewares/admin.js
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    // Buscamos o usuário pelo ID que o middleware de autenticação já nos forneceu
    const user = await User.findByPk(req.userId);

    // Verificamos se o 'role' do usuário é ADMIN
    if (!user || user.role !== 'ADMIN') {
      // 403 Forbidden: O servidor entendeu o pedido, mas se recusa a autorizá-lo.
      return res.status(403).json({ error: 'Acesso negado. Requer permissão de administrador.' });
    }

    // Se for admin, permite que a requisição continue
    return next();

  } catch (err) {
    return res.status(500).json({ error: 'Erro ao verificar permissões de administrador.' });
  }
};