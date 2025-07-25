if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({
    path: '.env.development',
  });
}

const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const swaggerDocs = require('../swagger');

require('./config/database'); 

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  '/files',
  express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
);


app.use('/api', routes);

swaggerDocs(app);

const PORT = process.env.APP_PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Server rodando na porta ${PORT}`);
});
