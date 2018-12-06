const brands = (sequelize, DataTypes) => {
  const Brands = sequelize.define(
    'brands',
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
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image_thumb: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      underscored: true,
    },
  );

  Brands.associate = (models) => {
    Brands.hasOne(
      models.Products,
      { foreignKey: 'brand_id' },
    );
  };

  return Brands;
};

export default brands;
