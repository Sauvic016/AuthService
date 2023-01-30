const express = require("express");

const UserController = require("../../controllers/user-controller");
const { AuthRequestValidators } = require("../../middlewares/index");

const router = express.Router();

router.post("/signup", AuthRequestValidators.validateUserAuth, UserController.create);
router.post("/signin", AuthRequestValidators.validateUserAuth, UserController.signIn);

router.get("/isAuthenticated", UserController.isAuthenticated);
router.get("/isAdmin", AuthRequestValidators.validateIsAdminRequest, UserController.isAdmin);
router.get("/verify-email", UserController.verifyEmailToken);
router.get("/users/:id", UserController.getEmailById);

module.exports = router;
