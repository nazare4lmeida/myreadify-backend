// src/models/Book.js (Versão Corrigida FINAL para full_cover_url como DataTypes.VIRTUAL)

const { Model, DataTypes } = require("sequelize");

class Book extends Model {
  static init(sequelize) {
    super.init(
      {
        id: { // Adicionado id para garantir que está sempre presente
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        title: DataTypes.STRING,
        author: DataTypes.STRING,
        category: DataTypes.STRING,
        cover_url: DataTypes.STRING, // Este campo armazena o nome do arquivo OU o caminho relativo do mock
        status: DataTypes.STRING,
        slug: DataTypes.STRING,
        // CORREÇÃO CRÍTICA AQUI: Definir 'full_cover_url' como um campo VIRTUAL
        full_cover_url: {
          type: DataTypes.VIRTUAL,
          get() {
            if (!this.cover_url) return null;

            // Se cover_url for um caminho relativo (do mockdata, ex: "/src/assets/...")
            if (this.cover_url.startsWith('/src/assets')) {
              return this.cover_url; // Retorna o caminho relativo diretamente
            } 
            // Caso contrário, assume que é um nome de arquivo de upload e monta a URL completa
            else {
              // process.env.APP_URL deve ser o URL base do seu backend (ex: https://myreadify-backend.onrender.com)
              return `${process.env.APP_URL}/files/${this.cover_url}`;
            }
          }
        }
      },
      {
        sequelize,
        tableName: "books",
        underscored: true,
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        modelName: "Book",
        // REMOVIDO: O objeto 'getters' separado não é mais necessário para 'full_cover_url'
        // pois ele foi definido como um DataTypes.VIRTUAL diretamente nos atributos.
      }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.Summary, {
      foreignKey: 'book_id',
      as: 'summaries',
    });
    this.hasMany(models.Review, {
      foreignKey: 'book_id',
      as: 'reviews',
    });
  }
}

module.exports = Book;
