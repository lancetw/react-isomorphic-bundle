import compose from 'koa-compose';
import users from './users';

const router = compose([
        users.middleware()
      ]);

export default router;
