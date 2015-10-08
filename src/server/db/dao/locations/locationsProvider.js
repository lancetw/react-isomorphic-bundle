const bcrypt = require('co-bcrypt')
const hashids = require('src/shared/utils/hashids-plus')
const models = require('src/server/db/models')
import moment from 'moment'
import { isFinite } from 'lodash'

exports.create = function *(postId, info) {
  const fillable = [
    'postId',
    'geometry'
  ]
  if (!isFinite(+postId)) return false
  info.postId = postId
  return yield models.locations.create(info, { fields: fillable })
}

exports.update = function *(postId, info) {
  const fillable = [
    'geometry'
  ]
  if (!isFinite(+postId)) return false
  const location = yield models.locations.findOne({
    where: { postId: postId }
  })

  return yield location.update(info, { fields: fillable })
}

exports.destroy = function *(postId) {
  if (!isFinite(+postId)) return false
  const location = yield models.locations.findOne({ where: { postId: postId } })
  return yield location.destroy({ force: true })
}

/* eslint-disable max-len, camelcase */
exports.nearBy = function *(limit=20, dist=1000, center) {
  const { sequelize } = models
  const { dialect } = sequelize.options
  /*** PostGIS only ***/
  if ( dialect !== 'postgres') return {}
  if (!isFinite(+dist)) return {}
  console.log(center)
  if (typeof center === 'undefined' || center === null) return {}
  if (!isFinite(parseFloat(center.lat))) return {}
  if (!isFinite(parseFloat(center.lng))) return {}

  const status = 0
  const todayStart = moment().startOf('day').utc().format('YYYY-MM-DD HH:mm:ss.SSS Z')

  const sql = `SELECT posts.id,
                      posts.title,
                      ST_Distance(geometry, poi)/1000 AS distance_km
               FROM locations INNER JOIN posts ON (posts.id = locations.post_id),
                    (select ST_MakePoint(${center.lng},${center.lat})::geography as poi) as poi
               WHERE ST_DWithin(geometry, poi, ${dist})
                     AND posts.end_date >= '${todayStart}'
                     AND posts.status = ${status}
               ORDER BY ST_Distance(geometry, poi)
               LIMIT ${limit};`

  return yield sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}
