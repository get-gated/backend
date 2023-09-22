import {
  CACHE_MANAGER,
  CacheModule as CacheManagerModule,
  Global,
  Inject,
  Module,
  OnApplicationShutdown,
} from '@nestjs/common';
import { Cache, CacheOptions } from 'cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import CacheConfig from '@app/modules/cache/cache.config';
import { LoggerService } from '@app/modules/logger';

import { CacheLock } from './cache-lock.service';

@Global()
@Module({
  imports: [
    ConfigModule.forFeature(CacheConfig),
    CacheManagerModule.registerAsync<CacheOptions>({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        store: redisStore,
        isGlobal: true,
        ...config.get('cache').redis,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [CacheLock],
  exports: [CacheManagerModule, CacheLock],
})
export class CacheModule implements OnApplicationShutdown {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private log: LoggerService,
  ) {}

  async onApplicationShutdown(): Promise<void> {
    this.log.info('Shutting down CacheModule');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = (this.cacheManager.store as any).getClient();
    await client?.quit();
    this.log.info('CacheModule successfully shutdown');
  }
}
