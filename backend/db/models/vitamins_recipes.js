const vitamins_recipes = (sequelize, DataTypes) => {
  const Vitamins_recipes = sequelize.define(
    'vitamins_recipes',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: { isNumeric: true },
      },
    },
    {
      timestamps: false,
      underscored: true,
    },
  );

  Vitamins_recipes.associate = (models) => {
    Vitamins_recipes.belongsTo(
      models.Vitamins,
      { foreignKey: 'vitamin_id' },
    );
    Vitamins_recipes.belongsTo(
      models.Units,
      { foreignKey: 'unit_id' },
    );
  };

  return Vitamins_recipes;
};

export default vitamins_recipes;
