import { EntityRepository } from '@mikro-orm/postgresql';
import { Repository } from '@mikro-orm/core';

import UserEntity from '../user.entity';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
@Repository(UserEntity)
export default class UserRepository extends EntityRepository<UserEntity> {}
