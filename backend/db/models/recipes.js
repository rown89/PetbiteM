const recipes = (sequelize, DataTypes) => {
  const Recipes = sequelize.define(
    "recipes",
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
      }
    },
    {
      timestamps: false,
      underscored: true
    }
  );

  Recipes.associate = models => {
  };

  return Recipes;
};

export default recipes;
