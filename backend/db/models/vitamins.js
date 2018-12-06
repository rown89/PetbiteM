const vitamins = (sequelize, DataTypes) => {
  const Vitamins = sequelize.define(
    'vitamins',
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

  Vitamins.associate = (models) => {
    /* Vitamins.hasMany(
      models.Vitamins_recipes,
      { foreignKey: 'vitamin_id', constraints: false }
    ) */
  };

  return Vitamins;
};

export default vitamins;
