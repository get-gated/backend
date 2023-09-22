import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CqrsModule } from '@nestjs/cqrs';

import AppConfig from '../../app.config';
import PaymentConfig from './payment.config';
import entities from './entities';
import adapters from './services/payment-processor/adapters';
/*import eventHandlers from './event-handlers';*/
import { providers as commandProviders } from './commands';

import services from './services';
import StripeAdapter from './services/payment-processor/adapters/stripe.adapter';

import Stripe from 'stripe';

import { PaymentAppService } from './payment.app-service';
import { queryProviders } from './queries';

@Module({
  imports: [
    CqrsModule,
    MikroOrmModule.forFeature(entities),
    ConfigModule.forFeature(PaymentConfig),
    ConfigModule.forFeature(AppConfig),
  ],
  providers: [
    ...services,
    ...commandProviders,
    ...queryProviders,
    // ...eventHandlers,
    ...adapters,
    { provide: 'STRIPE', useValue: Stripe },
    PaymentAppService,
  ],
  exports: [StripeAdapter, PaymentAppService],
})
@Module({})
export class PaymentModule {}
