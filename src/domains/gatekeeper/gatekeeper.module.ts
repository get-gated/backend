import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CqrsModule } from '@nestjs/cqrs';

import { ServiceProviderModule } from '../service-provider';

import GatekeeperConfig from './gatekeeper.config';
import queryProviders, { controllers } from './queries';
import entities from './entities';
import { providers as commandProviders } from './commands';
import { GatekeeperService } from './gatekeeper.service';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forFeature(GatekeeperConfig),
    MikroOrmModule.forFeature(entities),
    ServiceProviderModule,
  ],
  providers: [...commandProviders, ...queryProviders, GatekeeperService],
  controllers: [...controllers],
})
export class GatekeeperModule {}
