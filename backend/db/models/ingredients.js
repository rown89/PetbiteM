const ingredients = (sequelize, DataTypes) => {
  const Ingredients = sequelize.define(
    'ingredients',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        validate: { isNumeric: true },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isAlpha: true, isLowercase: true },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      link: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      underscored: true,
    },
  );

  Ingredients.associate = (models) => {
    /* Ingredients.hasMany(
      models.Ingredients_recipes,
      { foreignKey: 'ingredient_id', constraints: false }
    ) */
  };

  return Ingredients;
};

export default ingredients;
