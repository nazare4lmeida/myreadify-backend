const { User } = require('../models');
// bcrypt não é mais necessário aqui, mas podemos deixar para futuras referências
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
      
      // >>> CORREÇÃO: Removemos o hash daqui e passamos a senha original <<<
      const user = await User.create({
        name,
        email,
        password, // Passando a senha em texto plano. O hook do model vai cuidar da criptografia.
        role: 'user',
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
      
      // >>> CORREÇÃO: Removemos o hash daqui também <<<
      const user = await User.create({
        name,
        email,
        password, // Passando a senha em texto plano. O hook do model vai cuidar da criptografia.
        role: 'admin',
      });

      return res.status(201).json({
        message: 'Administrador criado com sucesso!',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
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
      
      // A sua função checkPassword no model faz exatamente isso. Vamos usá-la!
      const passwordMatch = await user.checkPassword(password);

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
      console.error("ERRO NO LOGIN:", err);
      return res.status(500).json({ error: 'Erro ao fazer login.' });
    }
  }
}

module.exports = new AuthController();