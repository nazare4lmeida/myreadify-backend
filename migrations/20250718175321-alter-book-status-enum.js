'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('books', 'status', {
      type: Sequelize.ENUM('PENDING', 'APPROVED', 'REJECTED'), 
      allowNull: false,
      defaultValue: 'PENDING',
    });
  },

  down: async (queryInterface, Sequelize) => {

    return queryInterface.changeColumn('books', 'status', {
      type: Sequelize.ENUM('PENDING', 'APPROVED'),
      allowNull: false,
      defaultValue: 'PENDING',
    });
  }
};