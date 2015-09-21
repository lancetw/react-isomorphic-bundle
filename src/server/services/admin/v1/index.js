import compose from 'koa-compose'
import admins from './admins'
import posts from './posts'

const router = compose([
  admins.middleware(),
  posts.middleware()
])

export default router
