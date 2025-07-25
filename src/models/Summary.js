const { Model, DataTypes } = require('sequelize');

class Summary extends Model {
  static init(sequelize) {
    super.init(
      {
        title: DataTypes.STRING,
        author: DataTypes.STRING,
        category: DataTypes.STRING,
        content: DataTypes.TEXT,
        cover_path: DataTypes.STRING,
        status: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
        slug: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: 'summaries',
        timestamps: true,
        underscored: true,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'submitter',
    });
  }
}

module.exports = Summary;
