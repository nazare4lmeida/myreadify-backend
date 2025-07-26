'use strict';
const { Model, DataTypes } = require('sequelize');

class Book extends Model {
  static associate(models) {
    Book.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Book.hasMany(models.Summary, { foreignKey: 'book_id', as: 'summaries' });
    Book.hasMany(models.Review, { foreignKey: 'book_id', as: 'reviews' });
  }

  static init(sequelize) {
    return super.init(
      {
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        author: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        category: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        cover_url: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        slug: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        status: {
          type: DataTypes.ENUM('PENDING', 'COMPLETED'),
          allowNull: false,
          defaultValue: 'PENDING',
          validate: {
            isIn: {
              args: [['PENDING', 'COMPLETED']],
              msg: 'Status deve ser PENDING ou COMPLETED',
            },
          },
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
      },
      {
        sequelize,
        modelName: 'Book',
        tableName: 'books',
        underscored: true,
      }
    );
  }
}

module.exports = Book;
