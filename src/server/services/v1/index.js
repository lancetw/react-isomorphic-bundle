import compose from 'koa-compose'
import users from './users'
import usersInfo from './usersInfo'
import cals from './cals'
import posts from './posts'
import uploads from './uploads'
import searches from './searches'

const router = compose([
  users.middleware(),
  usersInfo.middleware(),
  posts.middleware(),
  cals.middleware(),
  uploads.middleware(),
  searches.middleware()
])

export default router
