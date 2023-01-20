const { StatusCodes } = require("http-status-codes");
const AppError = require("../error-handler");

class DuplicateEntryError extends AppError {
  constructor() {
    let errorName = "DuplicateEntryError";
    let explanation = "Email should be unique";
    super(errorName, "User already exists", explanation, StatusCodes.CONFLICT);
  }
}

module.exports = DuplicateEntryError;
