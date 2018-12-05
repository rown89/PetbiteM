const minerals_recipes = (sequelize, DataTypes) => {
    const Minerals_recipes = sequelize.define(
      "minerals_recipes",
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
  
    Minerals_recipes.associate = models => {
      Minerals_recipes.belongsTo(
        models.Minerals,
        { foreignKey: 'mineral_id' }
      )
      Minerals_recipes.belongsTo(
        models.Units,
        { foreignKey: 'unit_id' }
      )
    };
    
    return Minerals_recipes;
  };
  
  export default minerals_recipes;
  