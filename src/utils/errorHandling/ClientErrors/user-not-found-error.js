const { StatusCodes } = require("http-status-codes");
const AppError = require("../error-handler");

class UserNotFoundError extends AppError {
  constructor(id = null) {
    let error;
    if (!id) {
      error = {
        name: "UserNotFoundError",
        message: "Email not found. Please double-check the email you entered or sign up for a new account.",
        explanation: "Incorrect Email id Entered",
        statusCode: StatusCodes.NOT_FOUND,
      };
    } else {
      error = {
        name: "UserNotFoundError",
        message: "User not Found",
        explanation: "Incorrect UserId Entered",
        statusCode: StatusCodes.NOT_FOUND,
      };
    }

    super(error.name, error.message, error.explanation, error.statusCode);
  }
}
module.exports = UserNotFoundError;
