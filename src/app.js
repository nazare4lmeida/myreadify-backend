require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./models");

// Importação dos arquivos de rotas
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const checkAuthRoutes = require("./routes/checkAuthRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes");
const summaryRoutes = require("./routes/summaryRoutes");

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes(); 
  }

  middlewares() {
    this.server.use(
      cors({
        origin: [
          "http://localhost:5173",
          "https://myreadify-frontend.vercel.app/",
        ],
      })
    );
    this.server.use(express.json());
    this.server.use(
      "/files",
      express.static(path.resolve(__dirname, 'uploads'))
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

    // --- INÍCIO DA CORREÇÃO DE ORDEM ---

    // 1. ROTAS PÚBLICAS: Ações que qualquer pessoa pode fazer, sem precisar de login.
    this.server.use("/api", contactRoutes);
    this.server.use("/api", authRoutes);

    // 2. ROTAS DE LEITURA PÚBLICA: Ações de visualização que não precisam de login.
    this.server.use("/api", bookRoutes);
    this.server.use("/api", summaryRoutes); // ✅ Adicionada corretamente
    this.server.use("/api", reviewRoutes);

    // 3. ROTAS PROTEGIDAS: Exigem um token de autenticação válido.
    this.server.use("/api", checkAuthRoutes);
    this.server.use("/api", adminRoutes);

    // --- FIM DA CORREÇÃO DE ORDEM ---
  }
}

module.exports = new App().server;
