/*eslint-disable camelcase, new-cap */
'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED
      },
      email: {
        validate: {
          isEmail: true
        },
        unique: true,
        type: Sequelize.STRING
      },
      name: {
        allowNull: true,
        type: Sequelize.STRING
      },
      passwd: {
        allowNull: true,
        validate: {
          min: 6
        },
        type: Sequelize.STRING
      },
      status: Sequelize.INTEGER
    }, {
      freezeTableName: true,
      classMethods: {
        associate: function (models) {
          // associations can be defined here
        }
      }
    });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  }
};
