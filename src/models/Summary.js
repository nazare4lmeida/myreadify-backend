// src/models/Summary.js (VERSÃO FINAL COMPLETA E CORRIGIDA)

const { Model, DataTypes } = require('sequelize');

// Removido o 'slugify' pois não é mais necessário aqui
// const slugify = require('slugify');

class Summary extends Model {
  static init(sequelize) {
    super.init(
      {
        // <<< CORREÇÃO PRINCIPAL: O campo 'slug' foi completamente removido >>>
        // Deixamos apenas os campos que realmente existem na tabela 'summaries'.
        content: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'PENDING',
        }
      },
      {
        sequelize,
        modelName: 'Summary',
        tableName: 'summaries',
        underscored: true,
        // O 'hook' para gerar slug foi removido pois o campo não existe mais.
        timestamps: true, // Mantendo os timestamps se você os usa
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      }
    );

    return this;
  }

  // As associações estão corretas e não precisam de alteração.
  static associate(models) {
    this.belongsTo(models.Book, {
      foreignKey: 'book_id',
      as: 'book'
    });

    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  }
}

module.exports = Summary;