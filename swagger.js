// swagger.js
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

function setupSwagger(app) {
  const opts = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "MyReadify API",
        version: "1.0.0",
        description: "Documentação interativa da API MyReadify",
      },
    },
    apis: [path.join(__dirname, "./src/routes/*.js")], // todas as rotas
  };

  const swaggerSpec = swaggerJSDoc(opts);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log("✅ Swagger configurado em /api-docs");
}

module.exports = setupSwagger;
