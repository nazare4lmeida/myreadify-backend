const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs'); 
class User extends Model {
  static init(sequelize) {
    super.init({
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password_hash: DataTypes.STRING,
      role: {
        type: DataTypes.ENUM('USER', 'ADMIN'),
        defaultValue: 'USER',
      },
    }, {
      sequelize
    });
  }

  static associate(models) {
    this.hasMany(models.Book, { foreignKey: 'submitted_by', as: 'submitted_books' });
    this.hasMany(models.Review, { foreignKey: 'user_id', as: 'reviews' });
  }
  
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

module.exports = User;