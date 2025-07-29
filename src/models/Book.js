const { Model, DataTypes } = require("sequelize");

class Book extends Model {
  static init(sequelize) {
    super.init(
      {
        title: DataTypes.STRING,
        author: DataTypes.STRING,
        category: DataTypes.STRING,
        cover_url: DataTypes.STRING, // Este é o campo que armazena só o nome do arquivo (ex: 'lordoftherings.jpg' ou 'hash-xyz.jpg')
        status: DataTypes.STRING,
        slug: DataTypes.STRING,
        full_cover_url: {
          // DEFINIDO COMO UM CAMPO VIRTUAL
          type: DataTypes.VIRTUAL,
          get() {
            if (!this.cover_url) return null; // O backend SEMPRE irá montar a URL COMPLETA para a imagem // sejam imagens do mock (armazenadas como 'nome_do_arquivo.jpg') // ou imagens de upload.
            return `${process.env.APP_URL}/files/${this.cover_url}`;
          },
        },
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
      foreignKey: "book_id",
      as: "summaries",
    });
  }
}

module.exports = Book;
