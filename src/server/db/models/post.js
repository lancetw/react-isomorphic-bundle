module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define('posts', {
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
    order: {
      defaultValue: 0,
      type: Sequelize.INTEGER
    },
    fee: {
      allowNull: true,
      type: Sequelize.TEXT
    },
    type: {
      defaultValue: 0,
      type: Sequelize.INTEGER
    },
    prop: {
      defaultValue: 0,
      type: Sequelize.INTEGER
    },
    startDate: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
      field: 'start_date'
    },
    endDate: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
      field: 'end_date'
    },
    openDate: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
      field: 'open_date'
    },
    closeDate: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
      field: 'close_date'
    },
    dateType: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
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
    cid: {
      allowNull: true,
      type: Sequelize.BIGINT
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
      type: Sequelize.TEXT
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
      type: Sequelize.INTEGER
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

  Post.associate = (models) => {
    Post.belongsTo(models.users, {
      foreignKey: 'uid'
    });
    Post.hasOne(models.usersInfo, {
      foreignKey: 'uid'
    });
    Post.hasOne(models.locations, {
      foreignKey: 'postId'
    });
  };

  Post.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.updated_at;
    delete values.deleted_at;
    return values;
  };

  return Post;
};
