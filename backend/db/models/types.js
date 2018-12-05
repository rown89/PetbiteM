const types = (sequelize, DataTypes) => {
  const Types = sequelize.define(
    "types",
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
      }
    },
    {
      timestamps: false,
      underscored: true
    }
  );

  Types.associate = models => {
    Types.hasOne(
      models.Products,
      { foreignKey: "type_id" }
    );
  };

  return Types;
};

export default types;
