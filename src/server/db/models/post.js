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
    startDate: {
      validate: {
        isDate: true
      },
      allowNull: false,
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE,
      field: 'start_date'
    },
    endDate: {
      validate: {
        isDate: true
      },
      allowNull: false,
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE,
      field: 'end_date'
    },
    openDate: {
      validate: {
        isDate: true
      },
      allowNull: false,
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE,
      field: 'open_date'
    },
    closeDate: {
      validate: {
        isDate: true
      },
      allowNull: false,
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE,
      field: 'close_date'
    },
    dateType: {
      defaultValue: 0,
      type: Sequelize.INTEGER.UNSIGNED,
      field: 'date_type'
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
      validate: { min: -90, max: 90 },
      allowNull: true,
      defaultValue: null,
      type: Sequelize.DOUBLE.UNSIGNED
    },
    lng: {
      validate: { min: -180, max: 180 },
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
    },
    status: {
      defaultValue: 0,
      type: Sequelize.INTEGER.UNSIGNED
    }
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    },
    validate: {
      bothCoordsOrNone: function () {
        if ((this.lat === null) !== (this.lng === null)) {
          throw new Error(
            'Require either both latitude and longitude or neither'
          )
        }
      }
    },
    instanceMethods: {
      toJSON: function () {
        const values = this.get()
        delete values.created_at
        delete values.updated_at
        delete values.deleted_at
        return values
      }
    }
  })
}
