'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('summaries', 'slug', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      defaultValue: '', // provisório, será sobrescrito ao criar novos registros
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('summaries', 'slug');
  },
};
