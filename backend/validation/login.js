import Validator from "validator";
import isEmpty from "./is-empty";

module.exports = function validateLoginInput (data) {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  //Name
  if (!Validator.isEmail(data.username)){
    errors.username = "Email is invalid"
  }

  if (Validator.isEmpty(data.username)){
    errors.username = "Email field is required"
  } 

  if (Validator.isEmpty(data.password)){
    errors.password = "Password field is required"
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}