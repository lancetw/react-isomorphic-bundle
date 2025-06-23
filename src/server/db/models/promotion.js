module.exports = (sequelize, Sequelize) => {
  const Promotion = sequelize.define('promotions', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.BIGINT
    },
    script: {
      type: Sequelize.STRING
    },
    name: {
      allowNull: true,
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    comment: {
      allowNull: true,
      type: Sequelize.STRING
    }
  });

  Promotion.associate = (models) => {
    // associations can be defined here
  };

  Promotion.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.created_at;
    delete values.updated_at;
    delete values.deleted_at;
    return values;
  };

  return Promotion;
};
