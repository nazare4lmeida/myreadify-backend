const { Model, DataTypes } = require("sequelize");
const slugify = require("slugify");

class Summary extends Model {
  static init(sequelize) {
    super.init(
      {
        title: DataTypes.STRING,
        author: DataTypes.STRING,
        category: DataTypes.STRING,
        content: DataTypes.TEXT,
        cover_url: DataTypes.STRING,
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
            if (!url) return null;
            if (url.startsWith("http")) return url;
            return `${process.env.APP_URL}/files/${url}`;
          },
        },
      },
      {
        sequelize,
        tableName: "summaries",
        underscored: true,
      }
    );

    this.addHook("beforeCreate", async (summary) => {
      if (summary.title) {
        const slugifyOptions = {
          lower: true,
          strict: true,
          remove: /[*+~.()'"!:@]/g,
        };

        const baseSlug = slugify(summary.title, slugifyOptions);
        let slug = baseSlug;
        let counter = 1;

        while (await this.findOne({ where: { slug } })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }

        summary.slug = slug;
      }
    });
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "submitted_by",
      as: "submitter",
    });
  }
}

module.exports = Summary;
