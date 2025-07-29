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
    // usa APP_SECRET para validar
    const decoded = jwt.verify(token, process.env.APP_SECRET);
    req.userId = decoded.id;

    return next();
  } catch (err) {
    console.error("Erro no auth middleware:", err.message);
    return res.status(401).json({ error: "Token inválido." });
  }
};
