import compose from 'koa-compose'
import users from './users'
import posts from './posts'

const router = compose([
        users.middleware(),
        posts.middleware()
      ])

export default router
