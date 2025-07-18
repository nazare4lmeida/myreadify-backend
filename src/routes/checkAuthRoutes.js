// src/routes/checkAuthRoutes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const User = require('../models/User'); // 1. Importe o model User

// Rota protegida que valida o token e RETORNA os dados do usuário
router.get('/check-auth', authMiddleware, async (req, res) => {
  try {
    // 2. O authMiddleware já validou o token e nos deu o req.userId.
    // Agora, usamos esse ID para buscar os dados do usuário no banco.
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'name', 'email', 'role'], // Selecione os campos que o frontend precisa
    });

    if (!user) {
      // Caso o usuário tenha sido deletado mas o token ainda seja válido
      return res.status(404).json({ loggedIn: false, error: 'Usuário não encontrado.' });
    }

    // 3. Enviamos a resposta COMPLETA que o frontend espera
    return res.status(200).json({ loggedIn: true, user: user });

  } catch (error) {
    return res.status(500).json({ loggedIn: false, error: 'Erro interno do servidor.' });
  }
});

module.exports = router;