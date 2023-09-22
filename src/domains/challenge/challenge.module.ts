import { forwardRef, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule } from '@nestjs/config';
import { UtilsService } from '@app/modules/utils';

import AppConfig from '../../app.config';
import { UserModule } from '../user/user.module';
import { ServiceProviderModule } from '../service-provider';
import { PaymentModule } from '../payment/payment.module';

import entities from './entities';
import ChallengeConfig from './challenge.config';
import { TemplatingService } from './services/templating.service';
import {
  controllers as commandControllers,
  providers as commandProviders,
} from './commands';
import {
  controllers as queryControllers,
  providers as queryProviders,
} from './queries';
import ChallengeAppService from './challenge.app-service';
import { ChallengeService } from './services/challenge.service';

@Module({
  imports: [
    CqrsModule,
    MikroOrmModule.forFeature(entities),
    ConfigModule.forFeature(ChallengeConfig),
    ConfigModule.forFeature(AppConfig),
    forwardRef(() => UserModule),
    ServiceProviderModule,
    PaymentModule,
    // eslint-disable-next-line no-use-before-define
    ChallengeModule,
  ],
  providers: [
    UtilsService,
    TemplatingService,
    ChallengeAppService,
    ChallengeService,
    ...commandProviders,
    ...queryProviders,
  ],
  controllers: [...commandControllers, ...queryControllers],
  exports: [ChallengeAppService],
})
export class ChallengeModule {}
