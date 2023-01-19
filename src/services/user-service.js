const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserRepository = require("../repository/user-repository");
const { JWT_KEY } = require("../config/serverConfig");
const AppErrors = require("../utils/errorHandling/error-handler");

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async create(data) {
    try {
      // const duplicateUser = await this.userRepository.getByEmail(data.email);
      // // console.log(duplicateUser);
      // if (duplicateUser) {
      //   throw { name: "ServerError", message: "User already exists", explanation: "Logical Issue", statusCode: 500 };
      // }
      const user = await this.userRepository.create(data);
      return user;
    } catch (error) {
      if (error.name == "SequelizeValidationError") {
        throw error;
      }
      console.log("Something went wrong in the service layer");
      // throw new AppErrors("ServerError", "Something went wrong in service", "Logical Issue found", 500);
      throw error;
    }
  }

  async signIn(email, plainPassword) {
    try {
      // step 1-> fetch the user using the email
      const user = await this.userRepository.getByEmail(email);
      // step 2-> compare incoming plain password with the stored encrypted password
      const passwordsMatch = this.#checkPassword(plainPassword, user.password);

      if (!passwordsMatch) {
        console.log("Password doesn't match");
        throw { error: "Incorrect Password" };
      }
      // step 3-> if passwords match then create a token and send it to the user
      const newJWT = this.#createToken({ email: user.email, id: user.id });
      return newJWT;
    } catch (error) {
      console.log("Something went wrong in the sign in process");
      throw error;
    }
  }
  async isAuthenticated(token) {
    try {
      const response = this.#verifyToken(token);
      if (!response) {
        throw { error: "Invalid token" };
      }
      const user = await this.userRepository.getById(response.id);
      if (!user) {
        throw { error: "No user with the corresponding token exists" };
      }
      return user.id;
    } catch (error) {
      console.log("Something went wrong in the auth process");
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
      console.log("Something went wrong in token validation", error);
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
