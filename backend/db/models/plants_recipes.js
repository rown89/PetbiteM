const plants_recipes = (sequelize, DataTypes) => {
    const Plants_recipes = sequelize.define(
      "plants_recipes",
      {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
      },
        amount: {
          type: DataTypes.FLOAT,
          allowNull: true,
          validate: { isNumeric: true }
        },
      },
      {
        timestamps: false,
        underscored: true
      }
    );
  
    Plants_recipes.associate = models => {
      Plants_recipes.belongsTo(
        models.Plants,
        { foreignKey: 'plant_id' }
      )
      Plants_recipes.belongsTo(
        models.Units,
        { foreignKey: 'unit_id' }
      )
    };
    
    return Plants_recipes;
  };
  
  export default plants_recipes;
  