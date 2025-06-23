module.exports = (sequelize, Sequelize) => {
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
      type: Sequelize.DOUBLE,
      allowNull: true,
      defaultValue: null,
      validate: { min: -90, max: 90 }
    },
    lng: {
      type: Sequelize.DOUBLE,
      allowNull: true,
      defaultValue: null,
      validate: { min: -180, max: 180 }
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
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    }
  }, {
    validate: {
      bothCoordsOrNone() {
        if ((this.lat === null) !== (this.lng === null)) {
          throw new Error('Require either both latitude and longitude or neither');
        }
      }
    }
  });

  UserInfo.associate = (models) => {
    UserInfo.belongsTo(models.users, {
      foreignKey: 'uid'
    });
    UserInfo.belongsTo(models.posts, {
      foreignKey: 'uid'
    });
  };

  UserInfo.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.id;
    delete values.created_at;
    delete values.updated_at;
    delete values.deleted_at;
    return values;
  };

  return UserInfo;
};
