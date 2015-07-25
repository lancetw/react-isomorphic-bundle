import compose from 'koa-compose'
import users from './users'
import cals from './cals'
import posts from './posts'
import uploads from './uploads'

const router = compose([
        users.middleware(),
        posts.middleware(),
        cals.middleware(),
        uploads.middleware()
      ])

export default router
