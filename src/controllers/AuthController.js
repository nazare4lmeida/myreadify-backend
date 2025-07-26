const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {
  async register(req, res) {
    const { name, email, password } = req.body;

    try {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'E-mail já cadastrado.' });
      }

      const hashedPassword = await bcrypt.hash(password, 8);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'USER',
      });

      const token = jwt.sign({ id: user.id }, process.env.APP_SECRET, {
        expiresIn: '7d',
      });

      return res.status(201).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao registrar usuário.' });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ error: 'Usuário não encontrado.' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Senha incorreta.' });
      }

      const token = jwt.sign({ id: user.id }, process.env.APP_SECRET, {
        expiresIn: '7d',
      });

      return res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao fazer login.' });
    }
  }
}

module.exports = new AuthController();
