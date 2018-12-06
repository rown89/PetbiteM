import Sequelize from 'sequelize';

const sequelize = new Sequelize('petbitedb', 'rown', 'scrotolol', {
  host: '62.75.141.240',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  define: {
    underscored: true,
  },
});

const models = {
  Brands: sequelize.import('./brands'),
  Products: sequelize.import('./products'),
  Additives: sequelize.import('./additives'),
  Amino_acids: sequelize.import('./amino_acids'),
  Anal_comps: sequelize.import('./anal_comps'),
  Animals: sequelize.import('./animals'),
  Diets: sequelize.import('./diets'),
  Ingredients_recipes: sequelize.import('./ingredients_recipes'),
  Additives_recipes: sequelize.import('./additives_recipes'),
  Amino_acids_recipes: sequelize.import('./amino_acids_recipes'),
  Anal_comps_recipes: sequelize.import('./anal_comps_recipes'),
  Minerals_recipes: sequelize.import('./minerals_recipes'),
  Plants_recipes: sequelize.import('./plants_recipes'),
  Vitamins_recipes: sequelize.import('./vitamins_recipes'),
  Ingredients: sequelize.import('./ingredients'),
  Minerals: sequelize.import('./minerals'),
  Plants: sequelize.import('./plants'),
  Types: sequelize.import('./types'),
  Units: sequelize.import('./units'),
  Vitamins: sequelize.import('./vitamins'),
  Users: sequelize.import('./users'),
};

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
