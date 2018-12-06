const units = (sequelize, DataTypes) => {
  const Units = sequelize.define(
    'units',
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
        validate: { isAlpha: true },
      },
    },
    {
      timestamps: false,
      underscored: true,
    },
  );

  Units.associate = (models) => {
  };

  return Units;
};

export default units;
