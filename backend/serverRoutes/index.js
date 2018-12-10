import express from 'express';
// import bcrypt from 'bcrypt';
import passport from 'passport';
import Sequelize from 'sequelize';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
// import async from 'async';
import nodemailer from 'nodemailer';
import models from '../db/models';
import keys from './config/keys';
import validateRegisterInput from '../validation/register';
import validateLoginInput from '../validation/login';
import validateRecoveryInput from '../validation/recovery';

require('babel-polyfill');

const Op = Sequelize.Op;
const operatorsAliases = {
  $gt: Op.gt,
  $like: Op.like,
  $iLike: Op.iLike
};

const router = express.Router();

// Root
router.get('/'), (req, res) => {
  res.redirect('/login');
};

// Registration
router.post('/singup', (req, res) => {
  const where = {
    name: req.body.name,
    lastname: req.body.lastname,
    date: req.body.date,
    gender: req.body.gender,
    username: req.body.username,
    password: req.body.password,
  };

  const { errors, isValid } = validateRegisterInput(req.body);
  // Check Validation
  if (!isValid) {
    res.send({ errors });
  } else {
    models.Users.findOrCreate({ where })
      .all().then((user) => {
        if (user) {
          res.status(200).send({ success: true });
        }
      })
      .catch((err) => {
        console.log('Promise Error: ', err);
      });
  }
});

// Login
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  // Check Validation
  if (!isValid) {
    res.send({ errors });
  }

  const { username } = req.body;
  const { password } = req.body;

  models.Users.findOne({ where: { username } })
    .then((user) => {
      if (!user) {
        errors.username = 'User not found';
        res.send({ errors });
      } else {
        if (user.validPassword(password)) {
          const payload = {
            id: user.user_id,
            name: user.name,
            lastname: user.lastname
          };

          // JWT Token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 86400 * 30 },
            (err, token) => {
              res.send({ success: true, token: token });
            }
          );
        } else {
          errors.password = 'Password incorrect';
          res.status(404).send({ errors });
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// Forgot Password
router.post('/passRecovery', (req, res) => {
  const { errors, isValid } = validateRecoveryInput(req.body);
  // Check Validation
  if (!isValid) {
    res.send({ errors });
  } else {
    models.Users.findOne({ where: { username: req.body.username } })
      .then((user) => {
        if (!user) {
          errors.username = 'Email not found';
          res.send({ errors });
        } else {
          const token = crypto.randomBytes(20).toString('hex');
          console.log(token);

          user.update({
            resetPasswordToken: token,
            resetPasswordExpires: Date.now() + 360000,
          });

          const transporter = nodemailer.createTransport({
            host: 'petbite.it',
            port: 25,
            auth: {
              user: 'letmeknow@petbite.it',
              pass: keys.mailSecret,
            },
            tls: {
              rejectUnauthorized: false,
            },
          });

          const mailOptions = {
            from: 'letmeknow@petbite.it',
            to: user.username,
            subject: 'Petbite Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account. \n\n'
            + 'Please click on the following link, or paste this into your browser to complete the process: \n\n'
            + `http://petbite.it:9001/reset?token=${token} \n\n`
            + 'If you did not request this, please ignore this email and your password will remain unchanged. \n',
          };

          console.log('sending email');

          transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
              console.log('There was an error:', err);
            } else {
              console.log('here is the res: ', response);
              res.status(200).send({ success: true });
            }
          });
        }
      });
  }
});

// Reset Forgotten Password
router.get('/reset', (req, res) => {
  const { token } = req.query;
  res.redirect(`exp://192.168.1.197:19000/--/apppwreset?token=${token}`);
});

router.get('/apppwreset', (req, res) => {
  const { token } = req.query;
  models.Users.findOne({
    where: { resetPasswordToken: token, resetPasswordExpires: { $gt: new Date() } },
  })
    .then((user) => {
      console.log(user);
      if (user == null) {
        console.log('password reset link is invalid or has expired');
        res.json('password reset link is invalid or has expired');
      } else {
        res.status(200).send({ success: true, username: user.username, message: 'password reset link a-ok' });
      }
    })
    .catch((err) => {
      console.log('error:', err);
    });
});

router.put('/apppwchange', (req, res) => {
  models.Users.findOne({ where: { username: req.body.username, resetPasswordToken: req.body.token } })
    .then((user) => {
      if (user == null) {
        console.log("This user doesn't exist, cant change password");
        res.json("This user doesn't exist, cant change password");
      } else {
        user.update({
          password: req.body.password,
          resetPasswordExpires: null,
          resetPasswordToken: null,
        })
          .then(() => {
            res.status(200).send({
              success: true,
              message: 'Password changed correctly',
            });
          });
      }
    });
});

// Home
router.post('/home', passport.authenticate('jwt', { session: false }), (req, res) => {
  models.Brands.findAll({
    attributes: ['id', 'name', 'image'],
  })
    .then((brands) => {
      res.send(brands);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/productsList', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { idBrand } = req.body;
  const resp = req.body.selectedProductsByComposition;

  if (idBrand !== undefined) {
    models.Products.findAll({
      attributes: ['id', 'name', 'image', 'diet_id', 'animal_id'],
      where: { brand_id: idBrand },
      include: [{ model: models.Diets }],
    })
      .then((brandProducts) => {
        res.send(brandProducts);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  if (resp !== undefined) {
    models.Products.findAll({
      attributes: ['id', 'name', 'image', 'diet_id', 'animal_id'],
      where: { id: resp },
      include: [{ model: models.Diets }],
    })
      .then((brandProducts) => {
        res.send(brandProducts);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

router.post('/productDetail', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id } = req.body;
  models.Products.findAll({
    where: { id },
    include: [models.Diets, models.Types],
  })
    .then((productDetail) => {
      res.send(productDetail);
    })
    .catch((err) => {
      console.log(err);
    });
});

// Charts API
router.post('/productDetailIngredients', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id } = req.body;
  models.Ingredients_recipes.findAll({
    where: { product_id: id },
    include: [models.Ingredients, models.Units],
  })
    .then((Ingredients) => {
      res.send(Ingredients);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/productDetailAminoacids', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id } = req.body;
  models.Amino_acids_recipes.findAll({
    where: { product_id: id },
    include: [models.Amino_acids, models.Units],
  })
    .then((Aminoacids) => {
      res.send(Aminoacids);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/productDetailAnalyticalcompositions', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id } = req.body;
  models.Anal_comps_recipes.findAll({
    where: { product_id: id },
    include: [models.Anal_comps, models.Units],
  })
    .then((Analcomps) => {
      res.send(Analcomps);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/productDetailMinerals', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id } = req.body;
  models.Minerals_recipes.findAll({
    where: { product_id: id },
    include: [models.Minerals, models.Units],
  })
    .then((Minerals) => {
      res.send(Minerals);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/productDetailPlants', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id } = req.body;
  models.Plants_recipes.findAll({
    where: { product_id: id },
    include: [models.Plants, models.Units],
  })
    .then((Plants) => {
      res.send(Plants);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/productDetailVitamins', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id } = req.body;
  models.Vitamins_recipes.findAll({
    where: { product_id: id },
    include: [models.Vitamins, models.Units],
  })
    .then((Vitamins) => {
      res.send(Vitamins);
    })
    .catch((err) => {
      console.log(err);
    });
});

// Searchbar for Products Diets Type
router.post('/searchProductsAll', passport.authenticate('jwt', { session: false }), (req, res) => {
  const product = req.body.search;
  models.Products.findAll({
    where: { name: { $iLike: '%' + product + '%' } },
    order: [['name', 'ASC']],
    attributes: ['id', 'name'],
    include: [models.Brands],
  })
    .then((products) => {
      res.send(products);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/searchProductsStandard', passport.authenticate('jwt', { session: false }), (req, res) => {
  const product = req.body.search;
  models.Products.findAll({
    where: { name: { $iLike: '%' + product + '%' }, diet_id: 1 },
    order: [['name', 'ASC']],
    attributes: ['id', 'name'],
    include: [models.Brands],
  })
    .then((products) => {
      res.send(products);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/searchProductsDiabets', passport.authenticate('jwt', { session: false }), (req, res) => {
  const product = req.body.search;
  models.Products.findAll({
    where: { name: { $iLike: '%' + product + '%' }, diet_id: 8 },
    order: [['name', 'ASC']],
    attributes: ['id', 'name'],
    include: [models.Brands],
  })
    .then((products) => {
      res.send(products);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/searchProductsHepatic', passport.authenticate('jwt', { session: false }), (req, res) => {
  const product = req.body.search;
  models.Products.findAll({
    where: { name: { $iLike: '%' + product + '%' }, diet_id: 2 },
    order: [['name', 'ASC']],
    attributes: ['id', 'name'],
    include: [models.Brands],
  })
    .then((products) => {
      res.send(products);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/searchProductsIntestinal', passport.authenticate('jwt', { session: false }), (req, res) => {
  const product = req.body.search;
  models.Products.findAll({
    where: { name: { $iLike: '%' + product + '%' }, diet_id: 5 },
    order: [['name', 'ASC']],
    attributes: ['id', 'name'],
    include: [models.Brands],
  })
    .then((products) => {
      res.send(products);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/searchProductsRenal', passport.authenticate('jwt', { session: false }), (req, res) => {
  const product = req.body.search;
  models.Products.findAll({
    where: { name: { $iLike: '%' + product + '%' }, diet_id: 7 },
    order: [['name', 'ASC']],
    attributes: ['id', 'name'],
    include: [models.Brands],
  })
    .then((products) => {
      res.send(products);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/searchProductsSterilised', passport.authenticate('jwt', { session: false }), (req, res) => {
  const product = req.body.search;
  models.Products.findAll({
    where: { name: { $iLike: '%' + product + '%' }, diet_id: 6 },
    order: [['name', 'ASC']],
    attributes: ['id', 'name'],
    include: [models.Brands],
  })
    .then((products) => {
      res.send(products);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/searchProductsUrinary', passport.authenticate('jwt', { session: false }), (req, res) => {
  const product = req.body.search;
  models.Products.findAll({
    where: { name: { $iLike: '%' + product + '%' }, diet_id: 3 },
    order: [['name', 'ASC']],
    attributes: ['id', 'name'],
    include: [models.Brands],
  })
    .then((products) => {
      res.send(products);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/searchProductsWeight%20Control', passport.authenticate('jwt', { session: false }), (req, res) => {
  const product = req.body.search;
  models.Products.findAll({
    where: { name: { $iLike: '%' + product + '%' }, diet_id: 10 },
    order: [['name', 'ASC']],
    attributes: ['id', 'name'],
    include: [models.Brands],
  })
    .then((products) => {
      res.send(products);
    })
    .catch((err) => {
      console.log(err);
    });
});

// Searchbar for Composition Elements
router.post('/searchElementsAminoacids', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { element } = req.body;
  models.Amino_acids.findAll({
    where: { name: { $iLike: '%' + element + '%' } },
    attributes: ['id', 'name'],
  })
    .then((Aminoacids) => {
      res.send(Aminoacids);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/searchElementsAnalytical-Compositions', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { element } = req.body;
  models.Anal_comps.findAll({
    where: { name: { $iLike: '%' + element + '%' } },
    attributes: ['id', 'name'],
  })
    .then((Anal) => {
      res.send(Anal);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/searchElementsIngredients', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { element } = req.body;
  models.Ingredients.findAll({
    where: { name: { $iLike: '%' + element + '%' } },
    attributes: ['id', 'name'],
  })
    .then((ingredients) => {
      res.send(ingredients);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/searchElementsMinerals', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { element } = req.body;
  models.Minerals.findAll({
    where: { name: { $iLike: '%' + element + '%' } },
    attributes: ['id', 'name'],
  })
    .then((Minerals) => {
      res.send(Minerals);
    })
    .catch((err) => {
      console.log(err);
    });;
});

router.post('/searchElementsVitamins', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { element } = req.body;
  models.Vitamins.findAll({
    where: { name: { $iLike: '%' + element + '%' } },
    attributes: ['id', 'name'],
  })
    .then((Vitamins) => {
      res.send(Vitamins);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/searchElementsPlants', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { element } = req.body;
  models.Plants.findAll({
    where: { name: { $iLike: '%' + element + '%' } },
    attributes: ['id', 'name'],
  })
    .then((Plants) => {
      res.send(Plants);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/selectedElementsAminoacids', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { elementID } = req.body;
  models.Amino_acids_recipes.findAll({
    where: { amino_acid_id: elementID },
    attributes: ['id', 'product_id'],
  })
    .then((Amino) => {
      res.send(Amino);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/selectedElementsAnalytical-Compositions', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { elementID } = req.body;
  models.Anal_comps_recipes.findAll({
    where: { anal_comp_id: elementID },
    attributes: ['id', 'product_id'],
  })
    .then((Anal) => {
      res.send(Anal);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/selectedElementsIngredients', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { elementID } = req.body;
  models.Ingredients_recipes.findAll({
    where: { ingredient_id: elementID },
    attributes: ['id', 'product_id'],
  })
    .then((ingredients) => {
      res.send(ingredients);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/selectedElementsMinerals', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { elementID } = req.body;
  models.Minerals_recipes.findAll({
    where: { mineral_id: elementID },
    attributes: ['id', 'product_id'],
  })
    .then((Minerals) => {
      res.send(Minerals);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/selectedElementsVitamins', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { elementID } = req.body;
  models.Vitamins_recipes.findAll({
    where: { vitamin_id: elementID },
    attributes: ['id', 'product_id'],
  })
    .then((Vitamins) => {
      res.send(Vitamins);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/selectedElementsPlants', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { elementID } = req.body;
  models.Plants_recipes.findAll({
    where: { plant_id: elementID },
    attributes: ['id', 'product_id'],
  })
    .then((Plants) => {
      res.send(Plants);
    })
    .catch((err) => {
      console.log(err);
    });
});

// Most Used Composition Elements in Recipes
router.post('/mostUsedAminoAcids', passport.authenticate('jwt', { session: false }), (req, res) => {
  models.Amino_acids_recipes.findAll({
    attributes: [[Sequelize.fn('count', Sequelize.col('amino_acid_id')), 'Aminocount']],
    having: Sequelize.where(Sequelize.fn('COUNT', Sequelize.col('amino_acid_id')), '>=', 1),
    include: [{ attributes: ['id', 'name'], model: models.Amino_acids }],
    group: ['amino_acid.id'],
  })
    .then((Amino) => {
      res.send(Amino);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/mostUsedAnalComps', passport.authenticate('jwt', { session: false }), (req, res) => {
  models.Anal_comps_recipes.findAll({
    attributes: [[Sequelize.fn('count', Sequelize.col('anal_comp_id')),'Analcount']],
    having: Sequelize.where(Sequelize.fn('COUNT', Sequelize.col('anal_comp_id')), '>=', 1),
    include: [{ attributes: ['id', 'name'], model: models.Anal_comps }],
    group: ['anal_comp.id'],
  })
    .then((Anal) => {
      res.send(Anal);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/mostUsedIngredients', passport.authenticate('jwt', { session: false }), (req, res) => {
  models.Ingredients_recipes.findAll({
    attributes: [[Sequelize.fn('count', Sequelize.col('ingredient_id')),'Ingredientcount']],
    having: Sequelize.where(Sequelize.fn('COUNT', Sequelize.col('ingredient_id')), '>=', 1),
    include: [{ attributes: ['id', 'name'], model: models.Ingredients }],
    group: ['ingredient.id'],
  })
    .then((Ingredients) => {
      res.send(Ingredients);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/mostUsedMinerals', passport.authenticate('jwt', { session: false }), (req, res) => {
  models.Minerals_recipes.findAll({
    attributes: [[Sequelize.fn('count', Sequelize.col('mineral_id')), 'Mineralcount']],
    having: Sequelize.where(Sequelize.fn('COUNT', Sequelize.col('mineral_id')), '>=', 1),
    include: [{ attributes: ['id', 'name'], model: models.Minerals }],
    group: ['mineral.id'],
  })
    .then((Minerals) => {
      res.send(Minerals);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/mostUsedVitamins', passport.authenticate('jwt', { session: false }), (req, res) => {
  models.Vitamins_recipes.findAll({
    attributes: [ [Sequelize.fn('count', Sequelize.col('vitamin_id')), 'Vitamincount' ]],
    having: Sequelize.where(Sequelize.fn('COUNT', Sequelize.col('vitamin_id')), '>=', 1),
    include: [{ attributes: ['id', 'name'], model: models.Vitamins }],
    group: ['vitamin.id'],
  })
    .then((Vitamins) => {
      res.send(Vitamins);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/mostUsedPlants', passport.authenticate('jwt', { session: false }), (req, res) => {
  models.Plants_recipes.findAll({
    attributes: [[Sequelize.fn('count', Sequelize.col('plant_id')), 'Plantcount']],
    having: Sequelize.where(Sequelize.fn('COUNT', Sequelize.col('plant_id')), '>=', 1),
    include: [{ attributes: ['id', 'name'], model: models.Plants }],
    group: ['plant.id'],
  })
    .then((Plants) => {
      res.send(Plants);
    })
    .catch((err) => {
      console.log(err);
    });
});

// Selected MostUsed
router.post('/selectedMostUsedAmino', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { elementID } = req.body;
  models.Amino_acids_recipes.findAll({
    where: { amino_acid_id: elementID },
    attributes: ['id', 'product_id','amount'],
    order: [[Sequelize.fn('max', Sequelize.col('amount')), 'DESC']],
    group: ['amino_acids_recipes.id']
  })
    .then((Amino) => {
      res.send(Amino);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/selectedMostUsedAnal', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { elementID } = req.body;
  models.Anal_comps_recipes.findAll({
    where: { anal_comp_id: elementID },
    attributes: ['id', 'product_id','amount'],
    order: [[Sequelize.fn('max', Sequelize.col('amount')), 'DESC']],
    group: ['anal_comps_recipes.id']
  })
    .then((Anal) => {
      res.send(Anal);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/selectedMostUsedIngr', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { elementID } = req.body;
  models.Ingredients_recipes.findAll({
    where: { ingredient_id: elementID },
    attributes: ['id', 'product_id', 'amount'],
    order: [[Sequelize.fn('max', Sequelize.col('amount')), 'DESC']],
    group: ['ingredients_recipes.id']
  })
    .then((Ingredient) => {
      res.send(Ingredient);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/selectedMostUsedMineral', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { elementID } = req.body;
  models.Minerals_recipes.findAll({
    where: { mineral_id: elementID },
    attributes: ['id', 'product_id', 'amount'],
    order: [[Sequelize.fn('max', Sequelize.col('amount')), 'DESC']],
    group: ['minerals_recipes.id']
  })
    .then((Mineral) => {
      res.send(Mineral);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/selectedMostUsedVitamin', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { elementID } = req.body;
  models.Vitamins_recipes.findAll({
    where: { vitamin_id: elementID },
    attributes: ['id', 'product_id', 'amount'],
    order: [[Sequelize.fn('max', Sequelize.col('amount')), 'DESC']],
    group: ['vitamins_recipes.id']
  })
    .then((Vitamin) => {
      res.send(Vitamin);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/selectedMostUsedPlant', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { elementID } = req.body;
  models.Plants_recipes.findAll({
    where: { plant_id: elementID },
    attributes: ['id', 'product_id', 'amount'],
    order: [[Sequelize.fn('max', Sequelize.col('amount')), 'DESC']],
    group: ['plants_recipes.id']
  })
    .then((Plant) => {
      res.send(Plant);
    })
    .catch((err) => {
      console.log(err);
    });
});

// Profile
router.post('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send({
    id: req.user.user_id,
    name: req.user.name,
    lastname: req.user.lastname,
  });
});

// Change Password in Settings
router.put('/changePassword', passport.authenticate('jwt', { session: false }), (req, res) => {
  models.Users.findOne({ where: { name: req.user.name } })
    .then((user) => {
      if (user == null) {
        console.log("This user doesn't exist, cant change password");
        res.json("This user doesn't exist, cant change password");
      } else {
        user.update({
          password: req.body.password,
          resetPasswordExpires: null,
          resetPasswordToken: null,
        })
          .then(() => {
            res.status(200).send({
              success: true,
              message: 'Password changed correctly',
            });
          });
      }
    });
});

module.exports = router;
