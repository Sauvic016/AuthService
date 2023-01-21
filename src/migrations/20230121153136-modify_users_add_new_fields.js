"use strict";

const randomBytes = require("randombytes");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("Users", "userName", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("Users", "userStatus", {
      type: Sequelize.ENUM,
      allowNull: false,
      defaultValue: "Pending",
      values: ["Pending", "Active"],
    });

    await queryInterface.addColumn("Users", "emailToken", {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: randomBytes(32).toString("hex"),
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("Users", "userStatus");
    await queryInterface.removeColumn("Users", "emailToken");
  },
};
