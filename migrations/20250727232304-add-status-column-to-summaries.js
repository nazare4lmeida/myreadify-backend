'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adiciona APENAS a coluna 'status' na tabela 'summaries'.
    await queryInterface.addColumn('summaries', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'PENDING', // Um valor padrão seguro
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Permite reverter a alteração, se necessário.
    await queryInterface.removeColumn('summaries', 'status');
  }
};