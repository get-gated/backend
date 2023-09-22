import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CqrsModule } from '@nestjs/cqrs';
import { CryptoModule } from '@app/modules/crypto';

import AppConfig from '../../app.config';

import ServiceProviderConfig from './service-provider.config';
import entities from './entities';
import { queryControllers, queryProviders } from './queries';
import {
  controllers as commandControllers,
  providers as commandProviders,
} from './commands';
import { ServiceProviderAppService } from './service-provider.app-service';
import services from './services';
import { ProviderService } from './services/provider/provider.service';

@Module({
  imports: [
    CryptoModule,
    CqrsModule,
    MikroOrmModule.forFeature(entities),
    ConfigModule.forFeature(ServiceProviderConfig),
    ConfigModule.forFeature(AppConfig),
  ],
  providers: [
    ...services,
    ...commandProviders,
    ...queryProviders,
    ProviderService,
    ServiceProviderAppService,
  ],
  controllers: [...commandControllers, ...queryControllers],
  exports: [ServiceProviderAppService],
})
export class ServiceProviderModule {}
