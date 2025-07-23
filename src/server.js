const app = require('./app');
require('../swagger')(app);


const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});