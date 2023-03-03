const { StatusCodes } = require("http-status-codes");

const validateUserAuth = (req, res, next) => {
  if (req.path === "/signin") {
    if (!req.body.email || !req.body.password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        data: {},
        message: "Please fill all the necessary details",
        err: "Email or password or UserName is missing in the request",
      });
    }
  } else {
    if (!req.body.email || !req.body.password || !req.body.name) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        data: {},
        message: "Please fill all the necessary details",
        err: "Email or password or UserName is missing in the request",
      });
    }
  }
  next();
};

const validateIsAdminRequest = (req, res, next) => {
  if (!req.body.id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      data: {},
      err: "User id cannot be empty",
      message: "User id not given",
    });
  }
  next();
};
const validateGrantRoleRequest = (req, res, next) => {
  if (!req.body.userId || !req.body.roleId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      data: {},
      err: "userId or roleId are not given",
      message: "Please fill all the necessary details",
    });
  }
  next();
};

const validateisAuthenticated = (req, res, next) => {
  if (!req.headers["x-access-token"]) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      data: {},
      err: "request tokens cannot be empty",
      message: "Please signin and try again",
    });
  }
  next();
};

module.exports = {
  validateUserAuth,
  validateIsAdminRequest,
  validateGrantRoleRequest,
  validateisAuthenticated,
};
