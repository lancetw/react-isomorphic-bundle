module.exports = function (sequelize, Sequelize) {
  const UserInfo = sequelize.define('usersInfo', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.BIGINT
    },
    uid: {
      allowNull: false,
      type: Sequelize.BIGINT
    },
    cid: {
      allowNull: true,
      type: Sequelize.BIGINT
    },
    ocname: {
      allowNull: true,
      type: Sequelize.STRING
    },
    contact: {
      allowNull: true,
      type: Sequelize.STRING
    },
    country: {
      allowNull: true,
      type: Sequelize.STRING
    },
    city: {
      allowNull: true,
      type: Sequelize.STRING
    },
    address: {
      allowNull: true,
      type: Sequelize.STRING
    },
    place: {
      allowNull: true,
      type: Sequelize.STRING
    },
    zipcode: {
      allowNull: true,
      type: Sequelize.STRING
    },
    lat: {
      validate: { min: -90, max: 90 },
      allowNull: true,
      defaultValue: null,
      type: Sequelize.DOUBLE
    },
    lng: {
      validate: { min: -180, max: 180 },
      allowNull: true,
      defaultValue: null,
      type: Sequelize.DOUBLE
    },
    tel: {
      allowNull: true,
      type: Sequelize.STRING
    },
    fax: {
      allowNull: true,
      type: Sequelize.STRING
    },
    url: {
      allowNull: true,
      type: Sequelize.STRING
    },
    email: {
      allowNull: true,
      validate: {
        isEmail: true
      },
      type: Sequelize.STRING
    }
  }, {
    classMethods: {
      associate: function (models) {
        UserInfo.belongsTo(models.users, {
          foreignKey: 'uid'
        });
        UserInfo.hasMany(models.posts, {
          foreignKey: 'uid'
        });
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
        delete values.id
        delete values.created_at
        delete values.updated_at
        delete values.deleted_at
        return values
      }
    }
  });

  return UserInfo;
}
