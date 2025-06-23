module.exports = (sequelize, Sequelize) => {
  const Admin = sequelize.define('admins', {
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
      allowNull: true,
      type: Sequelize.STRING
    },
    passwd: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        min: 6
      }
    },
    status: Sequelize.INTEGER,
    level: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    comment: {
      allowNull: true,
      type: Sequelize.STRING
    }
  });

  Admin.associate = (models) => {
    // associations can be defined here
  };

  Admin.prototype.toJSON = function () {
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

  return Admin;
};
