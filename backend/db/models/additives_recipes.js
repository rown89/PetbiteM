const additives_recipes = (sequelize, DataTypes) => {
    const Additives_recipes = sequelize.define(
      "additives_recipes",
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
  
    Additives_recipes.associate = models => {
      Additives_recipes.belongsTo(
        models.Additives,
        { foreignKey: 'additive_id' }
      )
      Additives_recipes.belongsTo(
        models.Units,
        { foreignKey: 'unit_id' }
      ) 
    };
    
    return Additives_recipes;
  };
  
  export default additives_recipes;
  