const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserRepository = require("../repository/user-repository");
const { JWT_KEY } = require("../config/serverConfig");
const ServiceError = require("../utils/errorHandling/Service-error");

const { PasswordMismatchError, TokenVerificationError } = require("../utils/errorHandling/ClientErrors/index");

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async create(data) {
    try {
      const user = await this.userRepository.create(data);
      return user;
    } catch (error) {
      if (error.name == "SequelizeValidationError") {
        throw error;
      }
      if (error.name == "DuplicateEntryError") {
        throw error;
      }
      // console.log("Something went wrong in the service layer");
      // throw error;
      throw new ServiceError();
    }
  }

  async signIn(email, plainPassword) {
    try {
      // step 1-> fetch the user using the email
      const user = await this.userRepository.getByEmail(email);
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
