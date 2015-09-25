module.exports = function (sequelize, Sequelize) {
  return sequelize.define('promotions', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.BIGINT
    },
    script: {
      validate: {
        isUrl: true
      },
      unique: true,
      type: Sequelize.STRING
    },
    name: {
      allowNull: true,
      type: Sequelize.STRING
    },
    status: {
      defaultValue: 0,
      type: Sequelize.INTEGER
    },
    comment: {
      allowNull: true,
      type: Sequelize.STRING
    }
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
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
  });
}
