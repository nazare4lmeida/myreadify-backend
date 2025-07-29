# 🛠️ MyReadify – Backend

API RESTful para gerenciamento de usuários, livros, resumos e avaliações, parte do projeto [MyReadify Frontend](https://github.com/nazare4lmeida/myreadify-frontend).

---

## 🧰 Tecnologias Utilizadas

- Node.js + Express
- PostgreSQL (via Supabase)
- JWT para autenticação
- Swagger para documentação
- Postman para testes
- Jest + Supertest (testes automatizados)

---

## 📂 Estrutura de Pastas

```
myreadify-backend/
├── src/
│   ├── controllers/      # Lógica das rotas
│   ├── models/           # Models Sequelize
│   ├── routes/           # Rotas separadas
│   ├── middlewares/      # Middlewares personalizados
│   ├── config/           # Configurações (ex: Multer)
│   ├── database/         # Conexão com o banco de dados
│   └── server.js         # Inicialização do servidor
├── tests/                # Testes com Jest/Supertest
├── docs/                 # Coleção Postman
├── swagger.js            # Configuração Swagger
└── .env
```

---

## Supabase

Este projeto utiliza o Supabase como banco de dados.

O backend estará disponível em `http://localhost:3000`.

---

## 🔐 Autenticação com JWT

- Após o login, o token JWT é retornado.
- Use o token no header para acessar rotas protegidas:

```
Authorization: Bearer <seu_token>
```

---

## 📄 Documentação Swagger

Acesse a documentação Swagger para visualizar e testar as rotas da API:

👉 [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

A documentação é gerada automaticamente a partir dos comentários nas rotas (`/src/routes/*.js`).

---

## 🧪 Testes Automatizados

Executa os testes com:

```bash
npm test
```

Testes incluídos:

- `tests/auth.test.js`
- `tests/summaries.test.js`

---

## 📬 Coleção Postman

A coleção pronta para testar a API está no repositório:

- [Download da Coleção MyReadify](./docs/MyReadify-Backend.postman_collection.json)

Inclui:

- Autenticação
- Rotas protegidas
- CRUD de livros, usuários, reviews, etc.

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz com o seguinte conteúdo:

```
PORT=3000
DATABASE_URL=postgresql://myreadify_user:myreadify_password@localhost:5432/myreadify_db
APP_SECRET=sua_chave_secreta
```

---

## ▶️ Rodando Localmente

### 1. Clone o repositório

```bash
git clone https://github.com/nazare4lmeida/myreadify-backend.git
cd myreadify-backend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Rode a aplicação

```bash
npm start
```

---

### ✅ Pronto! Já está rodando.

Feito por Nazaré Almeida