// src/models/Book.js

const { Model, DataTypes } = require('sequelize');
const slugify = require('slugify');

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
      slug: {
        type: DataTypes.STRING,
        unique: true,
      },
      full_cover_url: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.cover_url ? `https://myreadify-backend.onrender.com/files/${this.cover_url}` : null;
        }
      }
    }, {
      sequelize,
    });

    // --- HOOK CORRIGIDO ---
    // Usamos 'addHook' para adicionar a lógica.
    // Trocamos 'beforeValidate' por 'beforeCreate' para rodar apenas na criação do livro.
    this.addHook('beforeCreate', async (book) => {
      if (book.title) {
        const slugifyOptions = {
          lower: true,
          strict: true,
          remove: /[*+~.()'"!:@]/g
        };

        const baseSlug = slugify(book.title, slugifyOptions);
        let slug = baseSlug;
        let counter = 1;

        // Loop que verifica se o slug já existe.
        // `this` aqui se refere ao modelo 'Book'.
        while (await this.findOne({ where: { slug } })) {
          // Se existir, adiciona um número ao final e tenta de novo.
          slug = `${baseSlug}-${counter}`;
          counter++;
        }

        // Atribui o slug final e único ao livro que será criado.
        book.slug = slug;
      }
    });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'submitted_by', as: 'submitter' });
    this.hasMany(models.Review, { foreignKey: 'book_id', as: 'reviews' });
  }
}

module.exports = Book;