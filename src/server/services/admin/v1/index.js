import compose from 'koa-compose'
import admins from './admins'
import posts from './posts'
import users from './users'
import promotions from './promotions'

const router = compose([
  admins.middleware(),
  posts.middleware(),
  users.middleware(),
  promotions.middleware()
])

module.exports = router
