require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./models");

// Importação dos arquivos de rotas
const allRoutes = require("./routes"); // Importe o index.js da pasta routes

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    // Configuração do CORS
    this.server.use(cors({
      origin: ["http://localhost:5173", "https://myreadify-frontend.vercel.app"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }));

    this.server.use(express.json());
    this.server.use(
      "/files",
      express.static(path.resolve(__dirname, "uploads"))
    );
  }

  routes() {
    // --- ROTA DE DIAGNÓSTICO E RAIZ ---
    this.server.get("/health-check", async (req, res) => {
      try {
        await sequelize.authenticate();
        res.json({
          status: "ok",
          message: "Conexão com o banco de dados bem-sucedida!",
        });
      } catch (error) {
        console.error("FALHA NA CONEXÃO COM O BANCO:", error);
        res.status(500).json({
          status: "error",
          message: "Falha ao conectar com o banco de dados.",
          errorName: error.name,
          errorMessage: error.message,
        });
      }
    });

    this.server.get("/", (req, res) => {
      res.json({ message: "API MyReadify está no ar!" });
    });

    this.server.use("/api", allRoutes);
  }
}

module.exports = new App().server;
