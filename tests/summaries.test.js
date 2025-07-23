const request = require('supertest');
const app = require('../app');

describe('Summary routes', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'usuarioexistente@example.com',
      password: 'senha123',
    });
    token = res.body.token;
  });

  it('Deve criar um novo resumo', async () => {
    const res = await request(app)
      .post('/summaries')
      .set('Authorization', `Bearer ${token}`)
      .send({
        bookId: 1,
        summary: 'Este é um resumo de teste para o livro 1',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});
