const { StatusCodes } = require("http-status-codes");
const AppError = require("../error-handler");

class DuplicateEntryError extends AppError {
  constructor(message) {
    let errorName = "DuplicateEntryError";
    let explanation = "Email should be unique";
    super(errorName, message, explanation, StatusCodes.CONFLICT);
  }
}

module.exports = DuplicateEntryError;
