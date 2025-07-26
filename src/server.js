require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('🟢 Conexão com o banco de dados estabelecida com sucesso.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('🔴 Falha ao conectar com o banco de dados:', error);
    process.exit(1);
  }
}

startServer();

