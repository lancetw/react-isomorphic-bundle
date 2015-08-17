import jwt from 'jsonwebtoken'
import config from 'config'
import hashids from 'src/shared/utils/hashids-plus'

const opts = {}
opts.algorithm = config.jwt.OPTIONS.ALG
opts.expiresInMinutes = config.jwt.OPTIONS.EXP
opts.expiresInMinutes = config.jwt.OPTIONS.EXP
opts.issuer = config.jwt.OPTIONS.ISS
opts.audience = config.jwt.OPTIONS.AUD

export default function (profile) {
  const data = {}
  data.id = hashids.encode(profile.id)
  data.email = profile.email
  data.password = profile.password

  return jwt.sign(data, config.jwt.SECRET_OR_KEY, opts)
}

export async function verifyJwt (token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt.SECRET_OR_KEY, opts, function (err, decoded) {
      if (!err) {
        resolve(decoded.id)
      } else {
        reject(err)
      }
    })
  })
}
