const { Model, DataTypes } = require('sequelize');
const slugify = require('slugify');

class Book extends Model {
  static init(sequelize) {
    super.init(
      {
        title: {
          type: DataTypes.STRING,
          allowNull: false
        },
        author: {
          type: DataTypes.STRING,
          allowNull: false
        },
        category: {
          type: DataTypes.STRING,
          allowNull: false
        },
        cover_path: {
          type: DataTypes.STRING,
          allowNull: false
        },
        status: {
          type: DataTypes.ENUM('PENDING', 'COMPLETED'),
          defaultValue: 'PENDING'
        },
        slug: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
      },
      {
        sequelize,
        modelName: 'Book',
        tableName: 'books',
        underscored: true,
        hooks: {
          beforeValidate: (book) => {
            if (book.title && !book.slug) {
              book.slug = slugify(book.title, { lower: true });
            }
          }
        }
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    this.hasOne(models.Summary, {
      foreignKey: 'book_id',
      as: 'summary'
    });
  }
}

module.exports = Book;
