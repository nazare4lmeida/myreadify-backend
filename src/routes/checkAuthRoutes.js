const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

// Rota protegida que apenas valida se o token está válido
router.get('/check-auth', authMiddleware, (req, res) => {
  return res.status(200).json({ loggedIn: true });
});

module.exports = router;
