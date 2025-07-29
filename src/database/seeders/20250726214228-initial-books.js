"use strict";
const slugify = require("slugify");

const booksToSeed = [
  {
    title: "O Senhor dos Anéis",
    author: "J.R.R. Tolkien",
    category: "Fantasia",
    coverFilename: "lordoftherings.jpg",
  },
  {
    title: "1984",
    author: "George Orwell",
    category: "Ficção Científica",
    coverFilename: "1984.jpg",
  },
  {
    title: "O Sol é para Todos",
    author: "Harper Lee",
    category: "Clássicos",
    coverFilename: "tosol.jpg",
  },
  {
    title: "Orgulho e Preconceito",
    author: "Jane Austen",
    category: "Romance",
    coverFilename: "orgulhoepreconceito.jpg",
  },
  {
    title: "Duna",
    author: "Frank Herbert",
    category: "Ficção Científica",
    coverFilename: "duna.jpg",
  },
  {
    title: "Cem Anos de Solidão",
    author: "Gabriel García Márquez",
    category: "Clássicos",
    coverFilename: "cemanos.jpg",
  },
  {
    title: "A Guerra dos Tronos",
    author: "George R. R. Martin",
    category: "Fantasia",
    coverFilename: "tronos.jpg",
  },
  {
    title: "O Pequeno Príncipe",
    author: "Antoine de Saint-Exupéry",
    category: "Clássicos",
    coverFilename: "pequenoprincipe.jpg",
  },
  {
    title: "O Homem e Seus Símbolos",
    author: "Carl Gustav Jung",
    category: "Filosofia",
    coverFilename: "homemeseussimbolos.jpg",
  },
  {
    title: "As Dores do Mundo",
    author: "Arthur Schopenhauer",
    category: "Filosofia",
    coverFilename: "asdoresdomundo.jpg",
  },
  {
    title: "A Obscena Senhora D",
    author: "Hilda Hilst",
    category: "Romance",
    coverFilename: "aobscenasenhorad.jpg",
  },
  {
    title: "A Hora da Estrela",
    author: "Clarice Lispector",
    category: "Romance",
    coverFilename: "ahoradaestrela.jpg",
  },
  {
    title: "O Delicado Abismo da Loucura",
    author: "Raimundo Carrero",
    category: "Romance",
    coverFilename: "delicadoabismo.jpg",
  },
  {
    title: "Quarto de Despejo",
    author: "Carolina Maria de Jesus",
    category: "Não-ficção",
    coverFilename: "quartodedespejo.jpg",
  },
  {
    title: "O Diário de Anne Frank",
    author: "Anne Frank",
    category: "Não-ficção",
    coverFilename: "diariodeannefrank.jpg",
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const booksToInsert = booksToSeed.map((book) => ({
      title: book.title,
      author: book.author,
      category: book.category,
      // CORREÇÃO CRÍTICA AQUI: Salvar o caminho relativo completo
      cover_url: `/src/assets${book.coverFilename}`, 
      slug: slugify(book.title, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      }),
      status: "PENDING",
      user_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert("books", booksToInsert, {
      ignoreDuplicates: true, 
    });
  },

  down: async (queryInterface, Sequelize) => {
    const titles = booksToSeed.map((book) => book.title);
    await queryInterface.bulkDelete(
      "books",
      {
        title: {
          [Sequelize.Op.in]: titles,
        },
      },
      {}
    );
  },
};
