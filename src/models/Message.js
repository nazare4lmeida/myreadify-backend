const { Model, DataTypes } = require('sequelize');

class Message extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        subject: DataTypes.STRING,
        message: DataTypes.TEXT,
        is_read: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        modelName: 'Message',
        tableName: 'messages',
        timestamps: true,
        underscored: true,
      }
    );
  }
}

module.exports = Message;
