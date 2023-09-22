import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from '@app/modules/auth/auth.module';
import { GraphqlModule } from '@app/modules/graphql/graphql.module';
import { CacheModule } from '@app/modules/cache/cache.module';
import { LoggerModule } from '@app/modules/logger/logger.module';
import { EventBusModule } from '@app/modules/event-bus';
import { HealthModule } from '@app/modules/health/health.module';
import { TelemetryModule } from '@app/modules/telemetry/telemetry.module';
import { UtilsModule } from '@app/modules/utils';
import { AuthGuard } from '@app/modules/auth';
import { JobModule } from '@app/modules/job';
import { AsyncContextModule } from '@app/modules/async-context/async-context.module';

import { GatekeeperModule } from './domains/gatekeeper/gatekeeper.module';
import { ServiceProviderModule } from './domains/service-provider/service-provider.module';
import { UserModule } from './domains/user/user.module';
import { NotificationModule } from './domains/notification/notification.module';
import { PaymentModule } from './domains/payment/payment.module';
import { ChallengeModule } from './domains/challenge/challenge.module';
import AppConfig from './app.config';
import { DbModule } from './modules/db/db.module';
import { AnalyticsModule } from './domains/analytics/analytics.module';

@Module({
  imports: [
    AsyncContextModule,
    TelemetryModule,
    AuthModule,
    LoggerModule,
    JobModule,
    UtilsModule,
    HealthModule,
    CacheModule,
    CqrsModule,

    ConfigModule.forRoot({
      load: [AppConfig],
      cache: true,
    }),
    GraphqlModule,
    EventBusModule,
    DbModule,
    ServiceProviderModule,
    GatekeeperModule,
    UserModule,
    NotificationModule,
    PaymentModule,
    ChallengeModule,
    AnalyticsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
