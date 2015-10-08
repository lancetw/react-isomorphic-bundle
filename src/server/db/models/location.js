import { isArray } from 'lodash'

module.exports = function (sequelize, Sequelize) {
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
      get: function() {
        const geoPoint = this.getDataValue('geometry')
        return (geoPoint === null) ? null : geoPoint.coordinates
      },
      set: function(coords) {
        if (coords === null) {
          this.setDataValue('geometry', null)
        } else {
          this.setDataValue('geometry', { type: 'Point', coordinates: coords })
        }
      },
      validations: {
        isCoordinateArray: function(value) {
          if (!isArray(value) || value.length !== 2) {
            throw new Error('Must be an array with a coordinate')
          }
        }
      }
    }
  }, {
    classMethods: {
      associate: function (models) {
        Location.belongsTo(models.posts, {
          foreignKey: 'postId'
        })
      }
    },
    instanceMethods: {
      toJSON: function () {
        const values = this.get()
        delete values.updated_at
        delete values.deleted_at
        return values
      }
    }
  });

  return Location
}
