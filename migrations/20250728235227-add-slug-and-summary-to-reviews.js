// NOVO ARQUIVO DE MIGRATION: xxxxx-add-slug-and-summary-to-reviews.js (COLE ESTE CÓDIGO INTEIRO)

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adiciona a coluna 'slug' à tabela 'reviews' que já existe
    await queryInterface.addColumn('reviews', 'slug', {
      type: Sequelize.STRING,
      allowNull: true, // Permite ser nulo, pois avaliações de resumos não terão slug de livro
    });

    // Adiciona a coluna 'summary_id' à tabela 'reviews' que já existe
    await queryInterface.addColumn('reviews', 'summary_id', {
      type: Sequelize.INTEGER,
      allowNull: true, // Permite ser nulo, pois avaliações de livros não terão id de resumo
      references: { model: 'summaries', key: 'id' }, // Cria a chave estrangeira
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Comando para reverter as alterações, caso necessário
    await queryInterface.removeColumn('reviews', 'slug');
    await queryInterface.removeColumn('reviews', 'summary_id');
  }
};