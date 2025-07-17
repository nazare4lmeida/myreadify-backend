// src/server.js
const app = require('./app');

const port = process.env.APP_PORT || 3333;

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});