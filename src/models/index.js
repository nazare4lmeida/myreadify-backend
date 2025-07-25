const Sequelize = require("sequelize");
const dbConfig = require("../config/database");

const User = require("./User");
const Book = require("./Book");
const Review = require("./Review");
const Message = require("./Message");

let connection;

if (process.env.DATABASE_URL) {
  console.log("--- AMBIENTE DE PRODUÇÃO DETECTADO (Render) ---");
  console.log("Conectando via DATABASE_URL com SSL...");

  connection = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    define: dbConfig.define,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  console.log("--- AMBIENTE DE DESENVOLVIMENTO DETECTADO (Local) ---");
  console.log("Conectando via arquivo de configuração local...");
  connection = new Sequelize(dbConfig);
}

try {
  User.init(connection);
  Book.init(connection);
  Review.init(connection);
  Message.init(connection);

  Object.values(connection.models)
    .filter((model) => typeof model.associate === "function")
    .forEach((model) => model.associate(connection.models));

  console.log("Models inicializados e associados com sucesso.");
} catch (error) {
  console.error("!!!!!! FALHA CRÍTICA AO INICIALIZAR MODELS !!!!!!", error);
  throw error;
}

module.exports = connection;
