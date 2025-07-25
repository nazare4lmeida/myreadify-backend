const { Model, DataTypes } = require("sequelize");
const slugify = require("slugify");

class Book extends Model {
  static init(sequelize) {
    super.init(
      {
        title: DataTypes.STRING,
        author: DataTypes.STRING,
        category: DataTypes.STRING,
        cover_url: DataTypes.STRING,
        summary: DataTypes.TEXT,
        status: {
          type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
          defaultValue: "PENDING",
        },
        slug: {
          type: DataTypes.STRING,
          unique: true,
        },

        full_cover_url: {
          type: DataTypes.VIRTUAL,
          get() {
            const url = this.getDataValue("cover_url");
            if (!url) {
              return null;
            }

            if (url.startsWith("http")) {
              return url;
            }

            return `${process.env.APP_URL}/files/${url}`;
          },
        },
      },
      {
        sequelize,
      }
    );

    this.addHook("beforeCreate", async (book) => {
      if (book.title) {
        const slugifyOptions = {
          lower: true,
          strict: true,
          remove: /[*+~.()'"!:@]/g,
        };

        const baseSlug = slugify(book.title, slugifyOptions);
        let slug = baseSlug;
        let counter = 1;

        while (await this.findOne({ where: { slug } })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }

        book.slug = slug;
      }
    });
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "submitted_by",
      as: "submitter",
    });
    this.hasMany(models.Review, { foreignKey: "book_id", as: "reviews" });
  }
}

module.exports = Book;
