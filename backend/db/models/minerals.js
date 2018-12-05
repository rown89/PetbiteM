const minerals = (sequelize, DataTypes) => {
  const Minerals = sequelize.define(
    "minerals",
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

  Minerals.associate = models => {
    /*Minerals.hasMany(
      models.Minerals_recipes,
      { foreignKey: 'mineral_id', constraints: false }
    )*/
  };

  return Minerals;
};

export default minerals;
