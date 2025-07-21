'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adiciona a coluna com o nome CORRETO: 'created_at'
    await queryInterface.addColumn('books', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
    // Adiciona a coluna com o nome CORRETO: 'updated_at'
    await queryInterface.addColumn('books', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('books', 'created_at');
    await queryInterface.removeColumn('books', 'updated_at');
  }
};