import { registerAs } from '@nestjs/config';

import { getOptions } from '../../../mikro-orm.config';

export default registerAs('db', () => ({
  enableCrypto: process.env.DB_ENABLE_CRYPTO !== 'false',
  mikroOrm: getOptions(),
}));
