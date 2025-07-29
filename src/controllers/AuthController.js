const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Certifique-se de que 'jsonwebtoken' está instalado

class AuthController {
  async register(req, res) {
    const { name, email, password } = req.body;

    try {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'E-mail já cadastrado.' });
      }

      const user = await User.create({
        name,
        email,
        password,
        role: 'user',
      });

      // Gerar token JWT após o registro
      const token = jwt.sign({ id: user.id }, process.env.APP_SECRET, {
        expiresIn: '40d', // Validade do token
      });

      return res.status(201).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token, // O token é retornado aqui
        message: 'Registro realizado com sucesso!'
      });
    } catch (err) {
      console.error("ERRO NO REGISTRO DE USUÁRIO:", err);
      return res.status(500).json({ error: 'Erro ao registrar usuário.' });
    }
  }

  async registerAdmin(req, res) {
    const { name, email, password } = req.body;

    try {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'E-mail de admin já cadastrado.' });
      }

      const user = await User.create({
        name,
        email,
        password,
        role: 'admin',
      });

      // Gerar token JWT após o registro do admin
      const token = jwt.sign({ id: user.id }, process.env.APP_SECRET, {
        expiresIn: '40d',
      });

      return res.status(201).json({
        message: 'Administrador criado com sucesso!',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token, // O token é retornado aqui
      });
    } catch (err) {
      console.error("ERRO DETALHADO AO REGISTRAR ADMIN:", err);
      return res.status(500).json({ error: 'Erro ao registrar administrador.' });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ error: 'Usuário não encontrado.' });
      }

      const passwordMatch = await user.checkPassword(password);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Senha incorreta.' });
      }

      // Gerar token JWT após o login
      const token = jwt.sign({ id: user.id }, process.env.APP_SECRET, {
        expiresIn: '40d',
      });

      return res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token, // O token é retornado aqui
        message: 'Login realizado com sucesso!'
      });
    } catch (err) {
      console.error("ERRO NO LOGIN:", err);
      return res.status(500).json({ error: 'Erro ao fazer login.' });
    }
  }
}

module.exports = new AuthController();
