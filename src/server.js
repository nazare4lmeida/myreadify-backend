// src/server.js
const app = require('./app');

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});