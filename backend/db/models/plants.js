const plants = (sequelize, DataTypes) => {
  const Plants = sequelize.define(
    "plants",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        validate: { isNumeric: true }
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

  Plants.associate = models => {
    /*Plants.hasMany(
      models.Plants_recipes,
      { foreignKey: 'plant_id', constraints: false }
    )*/
  };

  return Plants;
};

export default plants;
