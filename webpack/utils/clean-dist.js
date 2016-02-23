'use strict';

import del from 'del';
import path from 'path';
import debug from 'debug';

module.exports = () => {
  const DIST_PATH = path.resolve(__dirname, '../../public/assets/*');
  del.sync([DIST_PATH]);
  debug('dev')('cleaned `public` directory');
};
