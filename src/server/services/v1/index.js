import compose from 'koa-compose'
import users from './users'
import posts from './posts'
import uploads from './uploads'

const router = compose([
        users.middleware(),
        posts.middleware(),
        uploads.middleware()
      ])

export default router
