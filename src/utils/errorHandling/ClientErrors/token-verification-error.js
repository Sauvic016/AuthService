const { StatusCodes } = require("http-status-codes");
const AppErrors = require("../error-handler");

class TokenVerificationError extends AppErrors {
  constructor() {
    let error = {
      name: "TokenVerificationError",
      message: "Invalid token, please sign in again.",
      explanation: "Incorrect Token Provided",
      statusCode: StatusCodes.FORBIDDEN,
    };
    super(error.name, error.message, error.explanation, error.statusCode);
  }
}

module.exports = TokenVerificationError;
