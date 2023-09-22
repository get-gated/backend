import {
  Global,
  Inject,
  Module,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { MikroOrmModule, MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { CryptoModule } from '@app/modules/crypto';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { MikroORM } from '@mikro-orm/core';
import { LoggerService } from '@app/modules/logger';

import { SensitiveFieldToken } from './sensitive.decorator';
import dbConfig from './db.config';
import { EntitySubscriber } from './entity.subscriber';
import { MikroOrmStorage } from './db.async-storage';

@Global()
@Module({
  imports: [
    CryptoModule,
    ConfigModule.forFeature(dbConfig),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService): MikroOrmModuleOptions => ({
        ...config.get('db').mikroOrm,
        registerRequestContext: false, // disable automatic middleware
        context: () => MikroOrmStorage.getStore(), // use our AsyncLocalStorage instance
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EntitySubscriber, DiscoveryService, MetadataScanner],
  exports: [MikroOrmModule],
})
export class DbModule implements OnApplicationBootstrap, OnApplicationShutdown {
  constructor(
    private entitySubscriber: EntitySubscriber,
    private reflector: Reflector,
    private log: LoggerService,
    private orm: MikroORM,
    @Inject(dbConfig.KEY) private config: ConfigType<typeof dbConfig>,
  ) {}

  onApplicationBootstrap(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.config.mikroOrm.entities?.forEach((entity: any) => {
      const metadata = this.reflector.get(SensitiveFieldToken, entity);
      if (metadata) {
        this.entitySubscriber.registerSensitiveFields(entity.name, metadata);
      }
    });
  }

  async onApplicationShutdown(): Promise<void> {
    this.log.info('Shutting down DbModule');
    await this.orm.close();
    this.log.info('DbModule successfully shutdown');
  }
}
