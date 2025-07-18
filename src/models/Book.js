// src/models/Book.js
const { Model, DataTypes } = require('sequelize');

class Book extends Model {
  static init(sequelize) {
    super.init({
      title: DataTypes.STRING,
      author: DataTypes.STRING,
      category: DataTypes.STRING,
      cover_url: DataTypes.STRING, // O nome da coluna no banco
      summary: DataTypes.TEXT,
      status: {
        type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
        defaultValue: 'PENDING',
      },
      // --- CAMPO VIRTUAL ADICIONADO ---
      full_cover_url: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.cover_url ? `http://localhost:3333/files/${this.cover_url}` : null;
        }
      }
    }, { sequelize });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'submitted_by', as: 'submitter' });
    this.hasMany(models.Review, { foreignKey: 'book_id', as: 'reviews' });
  }
}

module.exports = Book;