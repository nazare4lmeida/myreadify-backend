const { Model, DataTypes } = require("sequelize");

class Review extends Model {
  static init(sequelize) {
    return super.init(
      {
        rating: DataTypes.INTEGER,
        comment: DataTypes.TEXT,
      },
      {
        sequelize,
        tableName: "reviews",
        timestamps: true,
        underscored: true,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    this.belongsTo(models.Book, { foreignKey: "book_id", as: "book" });
  }
}

module.exports = Review;
