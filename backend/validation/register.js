import Validator from 'validator';
import isEmpty from './is-empty';

module.exports = function validateRegisterInput(data) {
  const errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.lastname = !isEmpty(data.lastname) ? data.lastname : '';
  data.date = !isEmpty(data.date) ? data.date : '';
  data.gender = !isEmpty(data.gender) ? data.gender : '';
  data.username = !isEmpty(data.username) ? data.username : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  // Name
  if (!Validator.isLength(data.name, { min: 4, max: 20 })) {
    errors.name = 'Name must be between 4 and 20 chars';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if (Validator.isEmpty(data.lastname)) {
    errors.lastname = 'Lastname field is required';
  }

  if (!Validator.isLength(data.lastname, { min: 2, max: 20 })) {
    errors.lastname = 'Lastname must be at least 2 characters';
  }

  if (Validator.isEmpty(data.date)) {
    errors.date = 'Date field is required';
  }

  if (!Validator.isISO8601(data.date)) {
    errors.date = 'Invalid Date format';
  }

  if (Validator.isEmpty(data.gender)) {
    errors.gender = 'Gender field is required';
  }

  if (!Validator.isLength(data.gender, { min: 1, max: 1 })) {
    errors.gender = 'gender have 1 char';
  }

  if (Validator.isEmpty(data.username)) {
    errors.username = 'Email field is required';
  }

  if (!Validator.isEmail(data.username)) {
    errors.username = 'Email is invalid';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm Password field is required';
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
