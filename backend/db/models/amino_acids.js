const amino_acids = (sequelize, DataTypes) => {
  const Amino_acids = sequelize.define(
    "amino_acids",
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

  Amino_acids.associate = models => {
    /*Amino_acids.hasMany(
      models.Amino_acids_recipes,
      { foreignKey: 'amino_acid_id', constraints: false }
    )*/
  };

  return Amino_acids;
};

export default amino_acids;
