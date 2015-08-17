import Resource from 'koa-resource-router'
import validate from 'parameter'
import parse from 'co-body'
import hashids from 'src/shared/utils/hashids-plus'
import RestAuth from 'src/server/passport/auth/rest-auth'
import db from 'src/server/db'
import multer from 'koa-multer'
import fs from 'fs'
import { include, isEmpty } from 'lodash'

const mimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf'
]

const MulterMiddleware = multer({
  putSingleFilesInArray: true,
  dest: './uploads/',
  rename: function (fieldname, filename) {
    return filename + '_' + Date.now()
  },
  limits: {
    fileSize: 1024 * 1024 * 3,
    files: 1
  },
  onFileSizeLimit: (file) => {
    file.failed = true
    fs.unlink('./' + file.path)
  },
  onFileUploadStart: (file, req, res) => {
    return include(mimeTypes, file.mimetype)
  }
})

export default new Resource('uploads', {
  // POST /uploads
  create: [ RestAuth, MulterMiddleware, function *(next) {
    if (Object.keys(this.req.files).length > 0) {
      const filename = Object.keys(this.req.files)[0]
      const fileinfo = this.req.files[filename][0]
      if (!fileinfo.failed) {
        this.body = {
          response: {
            name: fileinfo.name,
            ext: fileinfo.extension
          }
        }
        return
      }
    }

    this.body = { errors: 'upload error' }
  }]
})
