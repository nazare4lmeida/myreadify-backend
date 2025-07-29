// Este arquivo é o middleware de autenticação baseado em token.
// Para o teste sem token, ele não será usado e pode ser desinstalado ou ignorado.
// Se você o desinstalou, este arquivo pode ser removido.
/*
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return res.status(401).json({ error: "Token mal formatado." });
  }

  try {
    const decoded = jwt.verify(token, process.env.APP_SECRET);
    req.userId = decoded.id;

    return next();
  } catch (err) {
    console.error("Erro no auth middleware:", err.message);
    return res.status(401).json({ error: "Token inválido." });
  }
};
*/
