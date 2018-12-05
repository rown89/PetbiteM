const anal_comps = (sequelize, DataTypes) => {
  const Anal_comps = sequelize.define(
    "anal_comps",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isAlpha: true, isLowercase: true }
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      link: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    {
      timestamps: false,
      underscored: true
    }
  );

  Anal_comps.associate = models => {
    /*Anal_comps.hasMany(
      models.Anal_comps_recipes,
      { foreignKey: 'anal_comp_id', constraints: false }
    )*/
  };

  return Anal_comps;
};

export default anal_comps;
