const products = (sequelize, DataTypes) => {
  const Products = sequelize.define(
    "products",
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
      is_puppy:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      is_cereal_free:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      weight:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { isAlpha: true }
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      },
      image_thumb: {
        type: DataTypes.STRING,
        allowNull: true
      },
    },
    {
      timestamps: false,
      underscored: true
    }
  );

  Products.associate = models => {
    Products.belongsTo(
      models.Brands,
      { foreignKey: 'brand_id' }
    )
    Products.belongsTo(
      models.Diets,
      { foreignKey: 'diet_id' }
    )
    Products.belongsTo(
      models.Types,
      { foreignKey: 'type_id' }
    )
    Products.belongsTo(
      models.Animals,
      { foreignKey: 'animal_id' }
    )
    Products.hasMany(
      models.Additives_recipes,
      { foreignKey: 'product_id' }
    )
    Products.hasMany(
      models.Amino_acids_recipes,
      { foreignKey: 'product_id' }
    )
    Products.hasMany(
      models.Anal_comps_recipes,
      { foreignKey: 'product_id' }
    )
    Products.hasMany(
      models.Ingredients_recipes,
      { foreignKey: 'product_id' }
    )
    Products.hasMany(
      models.Minerals_recipes,
      { foreignKey: 'product_id' }
    )
    Products.hasMany(
      models.Plants_recipes,
      { foreignKey: 'product_id' }
    )
    Products.hasMany(
      models.Vitamins_recipes,
      { foreignKey: 'product_id' }
    )
  };

  return Products;
};

export default products;
