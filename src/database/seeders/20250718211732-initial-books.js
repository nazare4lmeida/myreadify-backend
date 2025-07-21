'use strict';
const slugify = require('slugify');

const booksToSeed = [
  { title: 'O Senhor dos Anéis', author: 'J.R.R. Tolkien', category: 'Fantasia' },
  { title: '1984', author: 'George Orwell', category: 'Ficção Científica' },
  { title: 'O Sol é para Todos', author: 'Harper Lee', category: 'Clássicos' },
  { title: 'Orgulho e Preconceito', author: 'Jane Austen', category: 'Romance' },
  { title: 'Duna', author: 'Frank Herbert', category: 'Ficção Científica' },
  { title: 'Cem Anos de Solidão', author: 'Gabriel García Márquez', category: 'Clássicos' },
  { title: 'A Guerra dos Tronos', author: 'George R. R. Martin', category: 'Fantasia' },
  { title: 'O Pequeno Príncipe', author: 'Antoine de Saint-Exupéry', category: 'Clássicos' },
  { title: 'O Homem e Seus Símbolos', author: 'Carl Gustav Jung', category: 'Filosofia' },
  { title: 'As Dores do Mundo', author: 'Arthur Schopenhauer', category: 'Filosofia' },
  { title: 'A Obscena Senhora D', author: 'Hilda Hilst', category: 'Romance' },
  { title: 'A Hora da Estrela', author: 'Clarice Lispector', category: 'Romance' },
  { title: 'O Delicado Abismo da Loucura', author: 'Raimundo Carrero', category: 'Romance' },
  { title: 'Quarto de Despejo', author: 'Carolina Maria de Jesus', category: 'Não-ficção' },
  { title: 'O Diário de Anne Frank', author: 'Anne Frank', category: 'Não-ficção' }
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const booksWithDetails = booksToSeed.map(book => ({
      ...book,
      summary: 'Este livro ainda não possui um resumo. Seja o primeiro a enviar o seu!',
      status: 'APPROVED',
      slug: slugify(book.title, { 
        lower: true, 
        strict: true,
        remove: /[*+~.()'"!:@]/g
      }),
      cover_url: null,

      // --- A CORREÇÃO FINAL ESTÁ AQUI ---
      // Usamos os nomes de coluna em snake_case, exatamente como o banco de dados espera.
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert('books', booksWithDetails, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('books', null, {});
  }
};