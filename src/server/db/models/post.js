/*eslint-disable camelcase, new-cap */
'use strict';

module.exports = function (sequelize, Sequelize) {
  return sequelize.define('posts', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.BIGINT.UNSIGNED
    },
    uid: {
      allowNull: false,
      type: Sequelize.BIGINT.UNSIGNED
    },
    order: {
      defaultValue: 0,
      type: Sequelize.INTEGER
    },
    fee: {
      defaultValue: 0,
      type: Sequelize.DECIMAL
    },
    type: {
      defaultValue: 0,
      type: Sequelize.INTEGER.UNSIGNED
    },
    prop: {
      defaultValue: 0,
      type: Sequelize.INTEGER.UNSIGNED
    },
    start_date: {
      allowNull: false,
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE
    },
    end_date: {
      allowNull: false,
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE
    },
    open_date: {
      allowNull: false,
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE
    },
    close_date: {
      allowNull: false,
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE
    },
    title: {
      allowNull: false,
      type: Sequelize.STRING
    },
    content: {
      allowNull: false,
      type: Sequelize.TEXT
    },
    ocname: {
      allowNull: true,
      type: Sequelize.STRING
    },
    lat: {
      validate: {min: -90, max: 90},
      allowNull: true,
      defaultValue: null,
      type: Sequelize.DOUBLE.UNSIGNED
    },
    lng: {
      validate: {min: -180, max: 180},
      allowNull: true,
      defaultValue: null,
      type: Sequelize.DOUBLE.UNSIGNED
    },
    country: {
      allowNull: true,
      type: Sequelize.STRING
    },
    city: {
      allowNull: true,
      type: Sequelize.STRING
    },
    place: {
      allowNull: true,
      type: Sequelize.STRING
    },
    zipcode: {
      allowNull: true,
      type: Sequelize.INTEGER(9).UNSIGNED
    },
    address: {
      allowNull: true,
      type: Sequelize.TEXT
    },
    url: {
      allowNull: true,
      type: Sequelize.TEXT
    },
    img: {
      allowNull: true,
      type: Sequelize.TEXT
    },
    file: {
      allowNull: true,
      type: Sequelize.TEXT
    }
  }, {
    freezeTableName: true,
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    },
    validate: {
      bothCoordsOrNone: function () {
        if ((this.latitude === null) !== (this.longitude === null)) {
          throw new Error('Require either both latitude and longitude or neither');
        }
      }
    }
  });
};
