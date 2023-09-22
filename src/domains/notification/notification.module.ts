import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import NotificationConfig from './notification.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CqrsModule } from '@nestjs/cqrs';
import * as SendGridMail from '@sendgrid/mail';

import entities from './entities';
import { providers as commandProviders } from './commands';
import queries from './queries';

import {
  SendGridToken,
  TxEmailAdapter,
} from './services/tx-email/tx-email.adapter';
import { TxEmailService } from './services/tx-email/tx-email.service';
import { UserModule } from '../user/user.module';
import { ChallengeModule } from '../challenge/challenge.module';
import { PaymentModule } from '../payment/payment.module';
import { NotificationAppService } from './notification.app-service';
import { ServiceProviderModule } from '../service-provider';
import { PushService } from './services/push/push.service';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forFeature(NotificationConfig),
    MikroOrmModule.forFeature(entities),
    forwardRef(() => UserModule),
    ChallengeModule,
    PaymentModule,
    ServiceProviderModule,
  ],
  providers: [
    { provide: SendGridToken, useValue: SendGridMail },
    TxEmailAdapter,
    {
      provide: SendGridToken,
      useValue: SendGridMail,
    },
    ...commandProviders,
    ...queries,
    TxEmailService,
    PushService,
    NotificationAppService,
  ],
  exports: [NotificationAppService],
})
export class NotificationModule {}
