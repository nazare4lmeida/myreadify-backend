const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        is_admin: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        hooks: {
          beforeSave: async (user) => {
            if (user.changed('password')) {
              user.password = await bcrypt.hash(user.password, 10);
            }
          },
        },
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Summary, {
      foreignKey: 'user_id',
      as: 'summaries',
    });

    this.hasMany(models.Review, {
      foreignKey: 'user_id',
      as: 'reviews',
    });

    this.hasMany(models.Message, {
      foreignKey: 'user_id',
      as: 'messages',
    });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

module.exports = User;
