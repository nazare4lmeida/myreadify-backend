// src/models/Book.js (Versão Corrigida com o Getter)

const { Model, DataTypes } = require("sequelize");

class Book extends Model {
  static init(sequelize) {
    super.init(
      {
        title: DataTypes.STRING,
        author: DataTypes.STRING,
        category: DataTypes.STRING,
        cover_url: DataTypes.STRING, // Este é o campo que armazena só o nome do arquivo
        status: DataTypes.STRING,
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

        // <<< A SEÇÃO QUE FALTOU VAI AQUI >>>
        // Adiciona um "campo virtual" que não existe no banco de dados.
        getterMethods: {
          // O nome do campo virtual será 'full_cover_url'
          full_cover_url() {
            // Se 'cover_url' existir, ele monta a URL completa.
            // Note que usamos '/files/', que é a mesma rota que você definiu em app.js!
            return this.cover_url
              ? `${process.env.APP_URL}/files/${this.cover_url}`
              : null;
          },
        },
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