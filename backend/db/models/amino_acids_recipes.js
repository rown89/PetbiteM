const amino_acids_recipes = (sequelize, DataTypes) => {
  const Amino_acids_recipes = sequelize.define(
    'amino_acids_recipes',
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

  Amino_acids_recipes.associate = (models) => {
    Amino_acids_recipes.belongsTo(
      models.Amino_acids,
      { foreignKey: 'amino_acid_id' },
    );
    Amino_acids_recipes.belongsTo(
      models.Units,
      { foreignKey: 'unit_id' },
    );
  };

  return Amino_acids_recipes;
};

export default amino_acids_recipes;
