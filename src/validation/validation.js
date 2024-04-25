
const emailPattern =
/^[a-zA-Z0-9_-]+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
const usernamePattern = /^[\w_-]{6,12}$/;
const passwordPattern = /(^[_=+*!@#$%^~`\w-]{8,16})+$/;

function validateSignUpForm(data) {
  const errors = {};

  if (!data.email) {
    errors.email = "Email is required";
  } else if (!emailPattern.test(data.email)) {
    errors.email = "email is not a valid";
  }
  if (!data.username) {
    errors.username = "username is required";
  } else if (!usernamePattern.test(data.username)) {
    errors.username = "username is not a valid";
  }
  if (!data.password) {
    errors.password = "password is required";
  } else if (!passwordPattern.test(data.password)) {
    errors.password = "password is not a valid";
  }
  return errors;
}
function validateLoginForm(data) {
  const errors = {};

  if (!data.email) {
    errors.email = "Email is required";
  } else if (!emailPattern.test(data.email)) {
    errors.email = "email is not a valid";
  }
  if (!data.password) {
    errors.password = "password is required";
  } else if (!passwordPattern.test(data.password)) {
    errors.password = "password is not a valid";
  }
  return errors;
}

module.exports = {
  validateSignUpForm,
  validateLoginForm,
};
