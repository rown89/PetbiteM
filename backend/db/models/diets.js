const diets = (sequelize, DataTypes) => {
  const Diets = sequelize.define(
    'diets',
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

  Diets.associate = (models) => {

  };

  return Diets;
};

export default diets;
