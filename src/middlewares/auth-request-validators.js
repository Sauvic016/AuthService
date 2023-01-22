const validateUserAuth = (req, res, next) => {
  if (!req.body.email || !req.body.password || !req.body.userName) {
    return res.status(400).json({
      success: false,
      data: {},
      message: "Please fill all the necessary details",
      err: "Email or password or UserName is missing in the request",
    });
  }
  next();
};

const validateIsAdminRequest = (req, res, next) => {
  if (!req.body.id) {
    return res.status(400).json({
      success: false,
      data: {},
      err: "User id not given",
      message: "Something went wrong",
    });
  }
  next();
};

module.exports = {
  validateUserAuth,
  validateIsAdminRequest,
};
