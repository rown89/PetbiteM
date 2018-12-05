const ingredients_recipes = (sequelize, DataTypes) => {
  const Ingredients_recipes = sequelize.define(
    "ingredients_recipes",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: { isNumeric: true }
      },
      is_primary: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      }
    },
    {
      timestamps: false,
      underscored: true
    }
  );

  Ingredients_recipes.associate = models => {
    Ingredients_recipes.belongsTo(
      models.Ingredients,
      { foreignKey: 'ingredient_id' }
    )
    Ingredients_recipes.belongsTo(
      models.Units,
      { foreignKey: 'unit_id' }
    )
  };

  return Ingredients_recipes;
};

export default ingredients_recipes;