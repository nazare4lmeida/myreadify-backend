// src/models/Book.js (Versão Final e Corrigida)

const { Model, DataTypes } = require("sequelize");

class Book extends Model {
  static init(sequelize) {
    super.init(
      {
        title: DataTypes.STRING,
        author: DataTypes.STRING,
        category: DataTypes.STRING,
        cover_url: DataTypes.STRING,
        status: DataTypes.STRING,

        // >>> ESTA É A ÚNICA LINHA ADICIONADA <<<
        // Informa ao Sequelize que a coluna 'slug' existe.
        slug: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: "books",
        underscored: true,
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        modelName: "Book",
      }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.Summary, {
      foreignKey: 'book_id',
      as: 'summaries',
    });
  }
}

module.exports = Book;