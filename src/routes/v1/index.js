const express = require("express");

const UserController = require("../../controllers/user-controller");
const { AuthRequestValidators } = require("../../middlewares/index");

const router = express.Router();

router.post("/signup", AuthRequestValidators.validateUserAuth, UserController.create);
router.post("/signin", AuthRequestValidators.validateUserAuth, UserController.signIn);
router.post("/grantrole", AuthRequestValidators.validateGrantRoleRequest, UserController.grantRole);

router.get("/isAuthenticated", AuthRequestValidators.validateisAuthenticated, UserController.isAuthenticated);
router.get("/isAdmin", AuthRequestValidators.validateIsAdminRequest, UserController.isAdmin);
router.get("/verify-email", UserController.verifyEmailToken);
router.get("/users/:id", UserController.getUserById);

module.exports = router;
