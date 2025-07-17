// src/middlewares/auth.js
const jwt = require('jsonwebtoken');
const { promisify } = require('util'); // Biblioteca nativa do Node.js

// Exportamos a função de middleware
module.exports = async (req, res, next) => {
  // 1. Pegar o token do cabeçalho da requisição
  const authHeader = req.headers.authorization;

  // 2. Verificar se o cabeçalho de autorização foi enviado
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  // 3. O token vem no formato "Bearer <token>". Vamos separar as duas partes.
  const [bearer, token] = authHeader.split(' ');

  // 4. Verificar se o token existe após a palavra "Bearer"
  if (!token) {
    return res.status(401).json({ error: 'Token mal formatado.' });
  }

  try {
    // 5. Verificar se o token é válido usando o segredo da nossa aplicação
    // Usamos 'promisify' para transformar a função de callback do jwt.verify em uma Promise,
    // o que nos permite usar async/await para um código mais limpo.
    const decoded = await promisify(jwt.verify)(token, process.env.APP_SECRET);

    // 6. Se o token for válido, 'decoded' conterá o payload que colocamos nele
    // durante o login ({ id, role }). Vamos anexar o ID do usuário à requisição.
    req.userId = decoded.id;

    // 7. Chamar next() para permitir que a requisição continue para o controller final.
    return next();

  } catch (err) {
    // Se a verificação falhar (token expirado, assinatura inválida), retorna um erro.
    return res.status(401).json({ error: 'Token inválido.' });
  }
};