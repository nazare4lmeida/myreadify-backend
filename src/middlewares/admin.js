const { User } = require("../models");

module.exports = async (req, res, next) => {
  console.log("AdminMiddleware: Requisição recebida para o caminho:", req.path); // NOVO
  if (!req.userId) {
    console.log(
      "AdminMiddleware: req.userId não encontrado para o caminho:",
      req.path
    ); // NOVO
    return res
      .status(401)
      .json({ error: "Falha na autenticação. ID do usuário não encontrado." });
  }

  try {
    const user = await User.findByPk(req.userId);
    console.log(
      "AdminMiddleware: Verificando role para userId:",
      req.userId,
      "role:",
      user?.role,
      "no caminho:",
      req.path
    ); // NOVO

    if (!user || user.role !== "admin") {
      console.log(
        "AdminMiddleware: Acesso negado (não é admin) para o caminho:",
        req.path
      ); // NOVO
      return res
        .status(403)
        .json({ error: "Acesso negado. Requer permissão de administrador." });
    }

    req.user = user;
    console.log(
      "AdminMiddleware: Acesso concedido (admin) para o caminho:",
      req.path
    ); // NOVO
    return next();
  } catch (err) {
    console.error(
      "Erro interno ao verificar permissões de administrador:",
      err
    );
    return res
      .status(500)
      .json({
        error: "Erro interno ao verificar permissões de administrador.",
      });
  }
};
