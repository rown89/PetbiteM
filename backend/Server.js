import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import passport from "passport";
import bcrypt from "bcrypt";
import router from "./serverRoutes"
import models from "./db/models";

const app = express();
const port = process.env.PORT || 9001;

app.use(morgan('dev'));
app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
require("./serverRoutes/config/passport")(passport);

app.use(router)

app.listen(port, () => {
    console.log(`\n Express Server UP on port:`, port, '\n');
});

models.sequelize.sync()
    .then(() => { console.log('\n Sequelize Synched!') })
    .catch((error) => { console.log('\n This error occured', error) });
