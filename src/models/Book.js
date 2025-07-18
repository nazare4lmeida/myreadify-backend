// src/models/Book.js

const { Model, DataTypes } = require('sequelize');
const slugify = require('slugify'); // Importe a biblioteca

class Book extends Model {
  static init(sequelize) {
    super.init({
      title: DataTypes.STRING,
      author: DataTypes.STRING,
      category: DataTypes.STRING,
      cover_url: DataTypes.STRING,
      summary: DataTypes.TEXT,
      status: {
        type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
        defaultValue: 'PENDING',
      },
      // --- Adicionamos o novo campo slug ---
      slug: {
        type: DataTypes.STRING,
        unique: true,
      },
      full_cover_url: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.cover_url ? `http://localhost:3333/files/${this.cover_url}` : null;
        }
      }
    }, {
      sequelize,
      // --- Adicionamos os Hooks aqui ---
      hooks: {
        beforeValidate: (book, options) => {
          if (book.title) {
            // Gera o slug a partir do título
            book.slug = slugify(book.title, { 
              lower: true,      // Converte para minúsculas
              strict: true,     // Remove caracteres especiais
              remove: /[*+~.()'"!:@]/g // Remove caracteres adicionais que podem causar problemas
            });
          }
        }
      }
    });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'submitted_by', as: 'submitter' });
    this.hasMany(models.Review, { foreignKey: 'book_id', as: 'reviews' });
  }
}

module.exports = Book;