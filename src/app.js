require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./models");

// Middlewares adicionais necessários
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const allRoutes = require("./routes");

class App {
  constructor() {
    this.server = express();
    
    // Configurações essenciais de segurança e CORS
    this.securityMiddlewares();
    this.middlewares();
    this.routes();
  }

  securityMiddlewares() {
    // Limite de requisições para evitar abuso
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100 // limite por IP
    });

    this.server.use(limiter);
    this.server.use(helmet());
    
    // Configuração completa de CORS
    this.server.use(cors({
      origin: [
        "http://localhost:5173",
        "https://myreadify-frontend.vercel.app"
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204
    }));
  }

  middlewares() {
    this.server.use(express.json({ limit: '10kb' }));
    this.server.use(express.urlencoded({ extended: true }));
    
    this.server.use(
      "/files",
      express.static(path.resolve(__dirname, "uploads"), {
        setHeaders: (res) => {
          res.set("Access-Control-Allow-Origin", "*");
        }
      })
    );
  }

  routes() {
    // Rotas de verificação de status
    this.server.get("/health-check", async (req, res) => {
      try {
        await sequelize.authenticate();
        res.status(200).json({
          status: "healthy",
          database: "connected",
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error("Database connection error:", error);
        res.status(503).json({
          status: "unavailable",
          database: "disconnected",
          error: error.message
        });
      }
    });

    this.server.get("/", (req, res) => {
      res.json({
        message: "MyReadify API",
        version: "1.0.0",
        documentation: "/api-docs",
        status: "operational"
      });
    });

    // Todas as rotas da API
    this.server.use("/api", allRoutes);
    
    // Middleware de erro global
    this.server.use((err, req, res, next) => {
      console.error("Global error handler:", err);
      res.status(err.status || 500).json({
        error: {
          message: err.message,
          details: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }
      });
    });
  }
}

// Exporta uma instância configurada do servidor
module.exports = new App().server;

