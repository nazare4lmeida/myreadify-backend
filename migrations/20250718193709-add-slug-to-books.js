// No novo arquivo de migration (ex: ...add-slug-to-books.js)
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('books', 'slug', {
      type: Sequelize.STRING,
      allowNull: true, // Temporariamente permite nulos para os livros existentes
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('books', 'slug');
  }
};