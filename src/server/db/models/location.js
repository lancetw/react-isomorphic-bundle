import { isArray } from 'lodash';

module.exports = (sequelize, Sequelize) => {
  const Location = sequelize.define('locations', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.BIGINT
    },
    postId: {
      allowNull: false,
      type: Sequelize.BIGINT,
      field: 'post_id'
    },
    geometry: {
      type: Sequelize.GEOMETRY('POINT'),
      get() {
        const geoPoint = this.getDataValue('geometry');
        return geoPoint === null ? null : geoPoint.coordinates;
      },
      set(coords) {
        if (coords === null) {
          this.setDataValue('geometry', null);
        } else {
          this.setDataValue('geometry', { type: 'Point', coordinates: coords });
        }
      },
      validate: {
        isCoordinateArray(value) {
          if (value !== null && (!isArray(value) || value.length !== 2)) {
            throw new Error('Must be an array with a coordinate');
          }
        }
      }
    }
  });

  Location.associate = (models) => {
    Location.belongsTo(models.posts, {
      foreignKey: 'postId'
    });
  };

  Location.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.updated_at;
    delete values.deleted_at;
    return values;
  };

  return Location;
};
