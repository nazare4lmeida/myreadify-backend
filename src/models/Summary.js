const { Model, DataTypes } = require('sequelize');
const slugify = require('slugify');

class Summary extends Model {
  static init(sequelize) {
    super.init(
      {
        content: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        slug: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'PENDING',
        }
      },
      {
        sequelize,
        modelName: 'Summary',
        tableName: 'summaries',
        underscored: true,
        hooks: {
          beforeValidate: (summary) => {
            if (summary.content && !summary.slug) {
              const preview = summary.content.slice(0, 50);
              summary.slug = slugify(preview, { lower: true });
            }
          }
        }
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Book, {
      foreignKey: 'book_id',
      as: 'book'
    });

    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  }
}

module.exports = Summary;
