// src/controllers/AuthController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
  async register(req, res) {
    const { name, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
      }

      const password_hash = await bcrypt.hash(password, 8);

      const user = await User.create({
        name,
        email,
        password_hash,
      });

      user.password_hash = undefined;

      return res.status(201).json(user);

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Falha no registro. Tente novamente.' });
    }
  }

  async authenticate(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ error: 'Usuário não encontrado.' });
      }

      if (!(await user.checkPassword(password))) {
        return res.status(401).json({ error: 'Senha incorreta.' });
      }

      const { id, name, role } = user;

      const token = jwt.sign({ id, role }, process.env.APP_SECRET, {
        expiresIn: '7d',
      });
      
      return res.json({
        user: { id, name, email, role },
        token,
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Falha na autenticação.' });
    }
  }
}

module.exports = new AuthController();