// src/models/User.js
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs'); // 1. Importe o bcrypt

class User extends Model {
  static init(sequelize) {
    // ... (o método super.init continua o mesmo)
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
    // Um usuário tem muitos livros (resumos enviados)
    this.hasMany(models.Book, { foreignKey: 'submitted_by', as: 'submitted_books' });
    // Um usuário tem muitas avaliações
    this.hasMany(models.Review, { foreignKey: 'user_id', as: 'reviews' });
  }

  // 2. Adicione este método
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

module.exports = User;