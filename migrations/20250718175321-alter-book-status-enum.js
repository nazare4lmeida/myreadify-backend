// Dentro do novo arquivo de migration
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('books', 'status', {
      type: Sequelize.ENUM('PENDING', 'APPROVED', 'REJECTED'), // Adiciona 'REJECTED'
      allowNull: false,
      defaultValue: 'PENDING',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // O 'down' reverte a mudança, caso necessário
    return queryInterface.changeColumn('books', 'status', {
      type: Sequelize.ENUM('PENDING', 'APPROVED'),
      allowNull: false,
      defaultValue: 'PENDING',
    });
  }
};