const { StatusCodes } = require("http-status-codes");
const AppError = require("../error-handler");

class PasswordMismatchError extends AppError {
  constructor() {
    let error = {
      name: "PasswordMismatchError",
      message: "The password you entered is incorrect. Please try again.",
      explanation: "Incorrect Password Enterred",
      statusCode: StatusCodes.FORBIDDEN,
    };
    super(error.name, error.message, error.explanation, error.statusCode);
  }
}

module.exports = PasswordMismatchError;
