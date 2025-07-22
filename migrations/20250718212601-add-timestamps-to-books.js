'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //
    // A ALTERAÇÃO ESTÁ AQUI.
    //
    // Deixamos a função 'up' vazia e retornamos uma promessa resolvida.
    // Fazemos isso porque as colunas 'created_at' e 'updated_at'
    // já existem na tabela 'books'. 
    //
    // Esta alteração evita o erro de "coluna duplicada" e permite que o 
    // Sequelize marque esta migração como "concluída" para poder
    // executar as próximas migrações pendentes (como a de criar a tabela 'Messages').
    //
    return Promise.resolve();
  },

  // Não mexemos na função 'down'. Ela permanece como estava para o caso
  // de, um dia, precisarmos reverter esta migração.
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('books', 'created_at');
    await queryInterface.removeColumn('books', 'updated_at');
  }
};