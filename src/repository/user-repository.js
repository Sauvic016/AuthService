const { User, Role } = require("../models/index");
const {
  ValidationError,
  DuplicateEntryError,
  UserNotFoundError,
} = require("../utils/errorHandling/ClientErrors/index.js");

class UserRepository {
  async create(data) {
    try {
      // const duplicateEntry = await this.getByEmail(data.email);
      // if (duplicateEntry) {
      //   throw new DuplicateEntryError();
      // }
      const user = await User.create(data);
      return user;
    } catch (error) {
      if (error.name == "SequelizeValidationError") {
        throw new ValidationError(error);
      }
      if (error.name == "SequelizeUniqueConstraintError") {
        throw new DuplicateEntryError(error);
      }
      console.log("Something went wrong on repositoryi layer");
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
        attributes: ["email", "id"],
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
      if (!user) {
        throw new UserNotFoundError();
      }
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
}
module.exports = UserRepository;
