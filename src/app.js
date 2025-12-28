require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./models");

const allRoutes = require("./routes");
const setupSwagger = require("../swagger");

class App {
  constructor() {
    this.server = express();

    this.securityMiddlewares();
    this.middlewares();
    this.routes();
  }

  securityMiddlewares() {
    this.server.set("trust proxy", true);

    // CONFIGURAÇÃO DE CORS ATUALIZADA PARA MOBILE
    this.server.use(
      cors({
        origin: (origin, callback) => {
          // Permite requisições sem 'origin' (comum em Apps Mobile e ferramentas de teste)
          if (!origin) return callback(null, true);
          
          const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:8081", // Porta padrão do Metro Bundler (Expo)
            "https://myreadify-frontend.vercel.app",
          ];

          // Em desenvolvimento, permite qualquer origem para facilitar testes no celular
          if (process.env.NODE_ENV === "development" || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
        credentials: true,
        optionsSuccessStatus: 204,
      })
    );
  }

  middlewares() {
    this.server.use(express.json({ limit: "10mb" }));
    this.server.use(express.urlencoded({ extended: true }));

    this.server.use(
      "/files",
      express.static(path.resolve(__dirname, "uploads"), {
        setHeaders: (res) => {
          res.set("Access-Control-Allow-Origin", "*");
        },
      })
    );
  }

  routes() {
    this.server.get("/health-check", async (req, res) => {
      try {
        await sequelize.authenticate();
        res.status(200).json({
          status: "healthy",
          database: "connected",
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        res.status(503).json({ status: "unavailable", error: error.message });
      }
    });

    this.server.get("/", (req, res) => {
      res.json({ message: "MyReadify API", status: "operational" });
    });

    setupSwagger(this.server);
    this.server.use("/api", allRoutes);

    this.server.use((err, req, res, next) => {
      console.error("Global error handler:", err);
      res.status(err.status || 500).json({
        error: {
          message: err.message,
          details: process.env.NODE_ENV === "development" ? err.stack : undefined,
        },
      });
    });
  }
}

module.exports = new App().server;