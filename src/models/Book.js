// src/models/book.js (Versão Completa e Corrigida)

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

  // >>> INÍCIO DA CORREÇÃO <<<
  static associate(models) {
    // Definimos que um Livro (Book) pode ter muitos Resumos (Summary)
    this.hasMany(models.Summary, {
      foreignKey: 'book_id',
      as: 'summaries',
    });
  }
  // >>> FIM DA CORREÇÃO <<<
}

module.exports = Book;