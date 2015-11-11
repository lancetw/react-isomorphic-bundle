let TongWen

if (process.env.BROWSER) {
  TongWen = require('./tongwen_core').TongWen
  require('./tongwen_table_s2t')(TongWen)
  require('./tongwen_table_t2s')(TongWen)
  require('./tongwen_table_ps2t')(TongWen)
  require('./tongwen_table_pt2s')(TongWen)
}

module.exports = TongWen
