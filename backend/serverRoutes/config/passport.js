const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
import Sequelize from "sequelize";
import models from "../../db/models";
const keys = require("./keys");

let opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
      models.Users.findById(jwt_payload.id)
      .then(user => {
        if (user){
          return done(null, user)
        }
        return done(null, false)
      }).catch(err => console.log(err))
    })
    )
}