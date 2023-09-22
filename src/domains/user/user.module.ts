import { forwardRef, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { CryptoModule } from '@app/modules/crypto';

import AppConfig from '../../app.config';
import { ServiceProviderModule } from '../service-provider';
import { ChallengeModule } from '../challenge/challenge.module';
import { NotificationModule } from '../notification/notification.module';

import UserConfig from './user.config';
import entities from './entities';
import {
  controllers as commandControllers,
  providers as commandProviders,
} from './commands';
import {
  controllers as queryControllers,
  providers as queryProviders,
} from './queries';
import { UserAppService } from './user.app-service';
import { UserService } from './user.service';

@Module({
  imports: [
    CryptoModule,
    CqrsModule,
    ServiceProviderModule,
    forwardRef(() => NotificationModule),
    forwardRef(() => ChallengeModule),
    ConfigModule.forFeature(UserConfig),
    ConfigModule.forFeature(AppConfig),
    MikroOrmModule.forFeature(entities),
  ],
  providers: [
    ...commandProviders,
    ...queryProviders,
    UserAppService,
    UserService,
  ],
  controllers: [...commandControllers, ...queryControllers],
  exports: [UserAppService],
})
export class UserModule {}
