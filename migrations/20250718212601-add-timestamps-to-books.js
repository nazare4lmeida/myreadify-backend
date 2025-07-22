'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    return Promise.resolve();
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('books', 'created_at');
    await queryInterface.removeColumn('books', 'updated_at');
  }
};