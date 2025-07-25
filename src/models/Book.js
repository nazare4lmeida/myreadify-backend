const { Model, DataTypes } = require("sequelize");

class Book extends Model {
  static init(sequelize) {
    return super.init(
      {
        title: DataTypes.STRING,
        author: DataTypes.STRING,
        category: DataTypes.STRING,
        cover_path: DataTypes.STRING,
        slug: DataTypes.STRING,
        status: DataTypes.ENUM("PENDING", "APPROVED"),
      },
      {
        sequelize,
        tableName: "books",
        timestamps: true,
        underscored: true,
      }
    );
  }
}

module.exports = Book;
