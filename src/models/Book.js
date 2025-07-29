// src/models/Book.js (Versão Corrigida com o Getter)

const { Model, DataTypes } = require("sequelize");

class Book extends Model {
  static init(sequelize) {
    super.init(
      {
        title: DataTypes.STRING,
        author: DataTypes.STRING,
        category: DataTypes.STRING,
        cover_url: DataTypes.STRING, // Este é o campo que armazena o caminho/nome do arquivo
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

        getterMethods: {
          // O nome do campo virtual será 'full_cover_url'
          full_cover_url() {
            if (!this.cover_url) return null;

            // Se a cover_url já começa com '/src/assets', significa que é uma imagem do mock
            // que o frontend precisa resolver localmente via Vite. O backend não a serve via /files.
            if (this.cover_url.startsWith('/src/assets')) {
              return this.cover_url; // Retorna o caminho como está para o frontend
            }

            // Caso contrário, assume que é um nome de arquivo de upload e constrói a URL completa.
            // process.env.APP_URL deve ser o URL base do backend (ex: https://api.myreadify.com)
            return `${process.env.APP_URL}/files/${this.cover_url}`;
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
    // Adicionar associação com Review se ainda não estiver aqui, para consistência
    this.hasMany(models.Review, {
      foreignKey: 'book_id',
      as: 'reviews',
    });
  }
}

module.exports = Book;
