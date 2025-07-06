const pg = require('pg')
// https://github.com/sequelize/sequelize/issues/1774
pg.defaults.parseInt8 = true
// https://github.com/sequelize/sequelize/issues/3781
delete pg.native

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(module.filename)
const env = process.env.NODE_ENV || 'development'
const config = require('config/sequelize/config')[env]
const account = require('config').sequelize
const sequelize = new Sequelize(
  account.DATABASE,
  account.USERNAME,
  account.PASSWORD,
  config
)
const db = {}

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== basename)
  })
  .forEach(function (file) {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  })

Object.keys(db).forEach(function (modelName) {
  /* istanbul ignore else */
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
