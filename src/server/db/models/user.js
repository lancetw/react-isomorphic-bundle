/*eslint-disable camelcase, new-cap */
'use strict';

module.exports = function (sequelize, Sequelize) {
  return sequelize.define('users', {
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
    },
    instanceMethods: {
      toJSON: function () {
        var values = this.get();
        delete values.id;
        delete values.passwd;
        delete values.password;
        delete values.created_at;
        delete values.updated_at;
        delete values.deleted_at;
        delete values.status;
        return values;
      }
    }
  });
};
