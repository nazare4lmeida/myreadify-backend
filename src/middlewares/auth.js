const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log("AuthMiddleware: Requisição recebida para o caminho:", req.path); // NOVO
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log(
      "AuthMiddleware: Token não fornecido para o caminho:",
      req.path
    ); // NOVO
    return res.status(401).json({ error: "Token não fornecido." });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    console.log(
      "AuthMiddleware: Token mal formatado para o caminho:",
      req.path
    ); // NOVO
    return res.status(401).json({ error: "Token mal formatado." });
  }

  try {
    const decoded = jwt.verify(token, process.env.APP_SECRET);
    req.userId = decoded.id;
    console.log(
      "AuthMiddleware: Token válido. userId:",
      req.userId,
      "para o caminho:",
      req.path
    ); // NOVO

    return next();
  } catch (err) {
    console.error("Erro no auth middleware:", err.message);
    console.log(
      "AuthMiddleware: Token inválido ou expirado para o caminho:",
      req.path
    ); // NOVO
    return res.status(401).json({ error: "Token inválido." });
  }
};
