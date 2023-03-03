const { User, Role } = require("../models/index");
const {
  ValidationError,
  DuplicateEntryError,
  UserNotFoundError,
} = require("../utils/errorHandling/ClientErrors/index.js");
const AppError = require("../utils/errorHandling/error-handler");
const sendVerificationMail = require("../utils/helpers/send-email");

class UserRepository {
  async create(data) {
    try {
      const user = await User.create(data);
      sendVerificationMail(user.userName, user.email, user.emailToken);
      return user;
    } catch (error) {
      if (error.name == "SequelizeValidationError") {
        throw new ValidationError(error);
      }
      if (error.name == "SequelizeUniqueConstraintError") {
        throw new DuplicateEntryError(error);
      }
      console.log("Something went wrong on repository layer");
      throw error;
    }
  }

  async destroy(userId) {
    try {
      const user = await User.destroy({
        where: {
          id: userId,
        },
      });
      return true;
    } catch (error) {
      console.log("Something went wrong on repository layer");
      throw error;
    }
  }

  async getById(userId) {
    try {
      const user = await User.findByPk(userId, {
        attributes: ["email", "id", "userName", "userStatus"],
      });
      if (!user) {
        throw new UserNotFoundError(userId);
      }
      return user;
    } catch (error) {
      console.log("Something went wrong on repository layer");
      throw error;
    }
  }

  async getByEmail(userEmail) {
    try {
      const user = await User.findOne({
        where: {
          email: userEmail,
        },
      });
      return user;
    } catch (error) {
      console.log("Something went wrong on repository layer");
      throw error;
    }
  }
  async isAdmin(userId) {
    try {
      const user = await User.findByPk(userId);
      const adminRole = await Role.findOne({
        where: {
          name: "ADMIN",
        },
      });
      return user.hasRole(adminRole);
    } catch (error) {
      console.log("Something went wrong on repository layer");
      throw error;
    }
  }

  async verifyEmailToken(token) {
    try {
      const user = await User.findOne({
        where: {
          emailToken: token,
        },
      });
      if (!user) {
        throw new UserNotFoundError();
      }
      user.userStatus = "Active";
      await user.save();
      return user;
    } catch (error) {
      console.log("Something went wrong on repository layer");
      throw error;
    }
  }

  async grantRole(userId, roleId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new UserNotFoundError();
      }
      const role = await Role.findByPk(roleId);
      if (!role) {
        throw new AppError("RoleNotFoundError", "User role does not exist", "Invalid roleId");
      }
      user.addRole(role);
      return true;
    } catch (error) {
      console.log("Something went wrong in the repository layer!");
      throw error;
    }
  }
}
module.exports = UserRepository;
