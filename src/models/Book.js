const { Model, DataTypes } = require('sequelize');

class Book extends Model {
  static init(sequelize) {
    super.init({
      title: DataTypes.STRING,
      author: DataTypes.STRING,
      category: DataTypes.STRING,
      cover_url: DataTypes.STRING,
      summary: DataTypes.TEXT,
      status: {
        type: DataTypes.ENUM('PENDING', 'APPROVED'),
        defaultValue: 'PENDING',
      },
    }, {
      sequelize
    });
  }

  // Definindo as associações
  static associate(models) {
    // Um livro pertence a um usuário (quem enviou)
    this.belongsTo(models.User, { foreignKey: 'submitted_by', as: 'submitter' });
    // Um livro pode ter muitas avaliações
    this.hasMany(models.Review, { foreignKey: 'book_id', as: 'reviews' });
  }
}

module.exports = Book;