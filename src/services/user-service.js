const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserRepository = require("../repository/user-repository");
const { JWT_KEY } = require("../config/serverConfig");
const ServiceError = require("../utils/errorHandling/Service-error");

const {
  PasswordMismatchError,
  TokenVerificationError,
  UserNotFoundError,
  DuplicateEntryError,
} = require("../utils/errorHandling/ClientErrors/index");
const AppError = require("../utils/errorHandling/error-handler");

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async create(data) {
    try {
      const duplicateEntry = await this.userRepository.getByEmail(data.email);
      if (duplicateEntry) {
        if (duplicateEntry.userStatus != "Active") {
          throw new DuplicateEntryError("User account already exists please verify your email and signin");
        }
        throw new DuplicateEntryError("User already exists please signin");
      }
      const user = await this.userRepository.create(data);
      return user;
    } catch (error) {
      if (error.name == "SequelizeValidationError") {
        throw error;
      }
      if (error.name == "DuplicateEntryError") {
        throw error;
      }
      if (error.name == "EmailServiceError") {
        throw error;
      }
      throw new ServiceError();
    }
  }

  async signIn(email, plainPassword) {
    try {
      // step 1-> fetch the user using the email
      const user = await this.userRepository.getByEmail(email);
      if (!user) {
        throw new UserNotFoundError();
      }
      // step 2-> compare incoming plain password with the stored encrypted password
      const passwordsMatch = this.#checkPassword(plainPassword, user.password);

      if (!passwordsMatch) {
        throw new PasswordMismatchError();
      }

      // if (user.userStatus != "Active") {
      //   throw new AppError("UserNotVerified", "User Email is not verified", "Verify you email", 403);
      // }
      // step 3-> if passwords match then create a token and send it to the user
      const newJWT = this.#createToken({ email: user.email, id: user.id });
      return newJWT;
    } catch (error) {
      if (error.name == "PasswordMismatchError") {
        throw error;
      }
      if (error.name == "UserNotFoundError") {
        throw error;
      }
      if (error.name == "UserNotVerified") {
        throw error;
      }
      throw new ServiceError();
    }
  }
  async isAuthenticated(token) {
    try {
      const response = this.#verifyToken(token);
      const user = await this.userRepository.getById(response.id);
      return user;
    } catch (error) {
      if (!error.name) {
        throw new ServiceError();
      }
      throw error;
    }
  }

  #createToken(user) {
    try {
      const result = jwt.sign(user, JWT_KEY, { expiresIn: "1d" });
      return result;
    } catch (error) {
      console.log("Something went wrong in token creation");
      throw error;
    }
  }
  #verifyToken(token) {
    try {
      const response = jwt.verify(token, JWT_KEY);
      return response;
    } catch (error) {
      if ((error.name = "JsonWebTokenError")) {
        throw new TokenVerificationError();
      }
      console.log("Something went wrong in token validation");
      throw error;
    }
  }
  #checkPassword(userInputPlainPassword, encryptedPassword) {
    try {
      return bcrypt.compareSync(userInputPlainPassword, encryptedPassword);
    } catch (error) {
      console.log("Something went wrong in password comparison");
      throw error;
    }
  }
  async isAdmin(userId) {
    try {
      const response = await this.userRepository.isAdmin(userId);
      return response;
    } catch (error) {
      console.log("Something went wrong in Service layer");
      throw error;
    }
  }
  async verifyEmailToken(token) {
    try {
      const response = await this.userRepository.verifyEmailToken(token);
      return response;
    } catch (error) {
      if (error.name == "UserNotFoundError") {
        throw error;
      }
      throw new ServiceError();
    }
  }

  async getUserById(id) {
    try {
      const response = await this.userRepository.getById(id);
      return response;
    } catch (error) {
      if (error.name == "UserNotFoundError") {
        throw error;
      }
      throw new ServiceError();
    }
  }
  async grantRole(userId, roleId) {
    try {
      console.log(userId, roleId);
      const response = await this.userRepository.grantRole(userId, roleId);
      return response;
    } catch (error) {
      if (error.name) {
        throw error;
      }
      throw new ServiceError();
    }
  }
}

module.exports = UserService;
