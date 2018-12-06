const anal_comps_recipes = (sequelize, DataTypes) => {
  const Anal_comps_recipes = sequelize.define(
    'anal_comps_recipes',
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

  Anal_comps_recipes.associate = (models) => {
    Anal_comps_recipes.belongsTo(
      models.Anal_comps,
      { foreignKey: 'anal_comp_id' },
    );
    Anal_comps_recipes.belongsTo(
      models.Units,
      { foreignKey: 'unit_id' },
    );
  };

  return Anal_comps_recipes;
};

export default anal_comps_recipes;
