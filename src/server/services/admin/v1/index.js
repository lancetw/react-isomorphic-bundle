import compose from 'koa-compose'
import admins from './admins'

const router = compose([
  admins.middleware()
])

export default router
