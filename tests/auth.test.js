const request = require('supertest');
const app = require('../app');

describe('Auth routes', () => {
  it('Deve registrar um novo usuário', async () => {
    const res = await request(app).post('/auth/register').send({
      username: 'usuarioTeste',
      email: `teste${Date.now()}@example.com`,
      password: 'senha123',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('Deve realizar login com sucesso', async () => {
    const loginRes = await request(app).post('/auth/login').send({
      email: 'usuarioexistente@example.com',
      password: 'senha123',
    });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty('token');
  });
});
