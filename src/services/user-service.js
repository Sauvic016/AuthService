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

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async create(data) {
    try {
      const duplicateEntry = await this.userRepository.getByEmail(data.email);
      if (duplicateEntry) {
        //todo:  custom message to user after checking email verification status
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
      throw new ServiceError();
    }
  }
  async isAuthenticated(token) {
    try {
      const response = this.#verifyToken(token);
      const user = await this.userRepository.getById(response.id);
      return user.id;
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
}

module.exports = UserService;
