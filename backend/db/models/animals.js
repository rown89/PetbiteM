const animals = (sequelize, DataTypes) => {
  const Animals = sequelize.define(
    'animals',
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
    },
    {
      timestamps: false,
      underscored: true,
    },
  );

  Animals.associate = (models) => {
    /* Animals.hasOne(
      models.Products,
      { foreignKey: "animal_id" }
    ); */
  };

  return Animals;
};

export default animals;
