const { Model, DataTypes } = require('sequelize');

class Review extends Model {
  static init(sequelize) {
    super.init({
      rating: DataTypes.INTEGER,
      comment: DataTypes.TEXT,
    }, {
      sequelize
    });
  }

  // Definindo as associações
  static associate(models) {
    // Uma avaliação pertence a um usuário
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    // Uma avaliação pertence a um livro
    this.belongsTo(models.Book, { foreignKey: 'book_id', as: 'book' });
  }
}

module.exports = Review;