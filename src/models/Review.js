const { Model, DataTypes } = require('sequelize');

class Review extends Model {
  static init(sequelize) {
    super.init(
      {
        content: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        rating: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: { min: 1, max: 5 }
        },
        // DEFINIMOS TODOS OS CAMPOS QUE A TABELA USA
        user_id: DataTypes.INTEGER,
        book_id: DataTypes.INTEGER,
        summary_id: DataTypes.INTEGER,
        slug: DataTypes.STRING, // <<< ESSA LINHA É A MAIS IMPORTANTE
      },
      {
        sequelize,
        modelName: 'Review',
        tableName: 'reviews',
        underscored: true
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Book, { foreignKey: 'book_id', as: 'book' });
    this.belongsTo(models.Summary, { foreignKey: 'summary_id', as: 'summary' });
  }
}

module.exports = Review;