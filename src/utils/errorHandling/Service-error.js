const AppError = require("./error-handler");

class ServiceError extends AppError {
  constructor() {
    super("ServicLayerError", "Something went wrong in Service", "Logical Issue Found");
  }
}
module.exports = ServiceError;
