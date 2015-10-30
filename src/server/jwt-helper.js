import jwt from 'jsonwebtoken'
import config from 'config'
import hashids from 'src/shared/utils/hashids-plus'

const opts = {}
opts.algorithm = config.jwt.OPTIONS.ALG
opts.expiresIn = config.jwt.OPTIONS.EXP
opts.issuer = config.jwt.OPTIONS.ISS
opts.audience = config.jwt.OPTIONS.AUD

export default function (profile, isAdmin=false) {
  const data = {}
  data.id = hashids.encode(profile.id)
  data.email = profile.email
  data.password = profile.password
  if (isAdmin) {
    data.isAdmin = true
  }

  return jwt.sign(data, config.jwt.SECRET_OR_KEY, opts)
}

export async function verifyJwt (token, checkAdmin=false) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt.SECRET_OR_KEY, opts, function (err, decoded) {
      if (!err) {
        if (checkAdmin) {
          if (decoded.isAdmin) {
            resolve(decoded.id)
          } else {
            throw new Error('Access Denied.')
          }
        } else {
          resolve(decoded.id)
        }
      } else {
        reject(err)
      }
    })
  })
}
