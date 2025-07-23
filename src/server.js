require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development',
});

const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const swaggerDocs = require('../swagger');

require('./config/database'); 

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
swaggerDocs(app);

const PORT = process.env.APP_PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Server rodando na porta ${PORT}`);
});
