const additives = (sequelize, DataTypes) => {
  const Additives = sequelize.define(
    "additives",
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

  Additives.associate = models => {
    /*Additives.hasMany(
      models.Additives_recipes,
      { foreignKey: 'additive_id' }
    )*/
  };

  return Additives;
};

export default additives;
