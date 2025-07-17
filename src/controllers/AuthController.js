// src/controllers/AuthController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
  // --- Método de Cadastro (Register) ---
  async register(req, res) {
    const { name, email, password } = req.body;

    try {
      // 1. Verifica se o email já está em uso para evitar duplicatas.
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
      }

      // 2. Criptografa a senha.
      const password_hash = await bcrypt.hash(password, 8);

      // 3. Cria o usuário. O 'role' usará o valor padrão ('USER') definido na migration.
      const user = await User.create({
        name,
        email,
        password_hash,
      });

      // 4. Nunca retorna o hash da senha na resposta.
      user.password_hash = undefined;

      return res.status(201).json(user);

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Falha no registro. Tente novamente.' });
    }
  }

  // --- Método de Login (Authenticate) ---
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

      // Gera o token JWT para o usuário logado
      const token = jwt.sign({ id, role }, process.env.APP_SECRET, {
        expiresIn: '7d',
      });
      
      return res.json({
        user: { id, name, email, role }, // Retornamos o 'role' para ser usado no front-end
        token,
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Falha na autenticação.' });
    }
  }
}

module.exports = new AuthController();