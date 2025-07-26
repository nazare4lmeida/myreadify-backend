const { Model, DataTypes } = require('sequelize');

class Message extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false
        },
        subject: {
          type: DataTypes.STRING,
          allowNull: false
        },
        message: {
          type: DataTypes.TEXT,
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'Message',
        tableName: 'messages',
        underscored: true
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  }
}

module.exports = Message;
