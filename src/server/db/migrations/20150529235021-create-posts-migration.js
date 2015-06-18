/*eslint-disable camelcase, new-cap */
'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('posts', {
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
      startDate: {
        allowNull: false,
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE,
        field: 'start_date'
      },
      endDate: {
        allowNull: false,
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE,
        field: 'end'
      },
      openDate: {
        allowNull: false,
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE,
        field: 'open_date'
      },
      closeDate: {
        allowNull: false,
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE,
        field: 'close_date'
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
        validate: {min: -90.0, max: 90.0},
        allowNull: true,
        defaultValue: null,
        type: Sequelize.DOUBLE.UNSIGNED
      },
      lng: {
        validate: {min: -90.0, max: 90.0},
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
      },
      instanceMethods: {
        toJSON: function () {
          var values = this.get();
          delete values.created_at;
          delete values.updated_at;
          delete values.deleted_at;
          return values;
        }
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('posts');
  }
};
