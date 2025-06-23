module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.BIGINT
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    passwd: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        min: 6
      }
    },
    status: Sequelize.INTEGER
  });

  User.associate = (models) => {
    User.hasMany(models.posts, {
      foreignKey: 'uid'
    });
    User.hasOne(models.usersInfo, {
      foreignKey: 'uid'
    });
  };

  User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.id;
    delete values.passwd;
    delete values.password;
    delete values.created_at;
    delete values.updated_at;
    delete values.deleted_at;
    delete values.status;
    return values;
  };

  return User;
};
