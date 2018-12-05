import bcrypt from 'bcrypt';

const users = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "users",
    {
      user_id: {
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
        validate: { isAlpha: true, min: 4, max: 20 }
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isAlpha: true, min: 4, max: 25 }
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: { isISO8601: true }
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isAlpha: true, min: 1, max: 1 }
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { min: 6, max: 30 }
      },
      resetPasswordToken: {
        type: DataTypes.STRING
      },
      resetPasswordExpires: {
        type: DataTypes.DATE
      }
    },{
      hooks: {
        beforeCreate: (user) => {
          const salt = bcrypt.genSaltSync();
          user.password = bcrypt.hashSync(user.password, salt);
        },
        beforeUpdate: (user) => {
          const salt = bcrypt.genSaltSync();
          user.password = bcrypt.hashSync(user.password, salt);
        }
      },
      timestamps: false,
      underscored: true
    })
  Users.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
    
  }
  return Users;
}

export default users;
