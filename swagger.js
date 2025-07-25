const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MyReadify API",
      version: "1.0.0",
      description: "Documentação da API do projeto MyReadify",
    },
    servers: [
      {
        url: "http://localhost:3333",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Documentação com base nos comentários JSDoc
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
