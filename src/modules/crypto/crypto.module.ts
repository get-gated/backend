import { KeyManagementServiceClient } from '@google-cloud/kms';
import { Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerService } from '@app/modules/logger';

import { CryptoService } from './crypto.service';
import CryptoConfig from './crypto.config';

@Module({
  imports: [ConfigModule.forFeature(CryptoConfig)],
  providers: [KeyManagementServiceClient, CryptoService],
  exports: [CryptoService],
})
export class CryptoModule implements OnApplicationShutdown {
  constructor(
    private kmsClient: KeyManagementServiceClient,
    private log: LoggerService,
  ) {}

  async onApplicationShutdown(): Promise<void> {
    this.log.info('Shutting down CryptoModule');
    await this.kmsClient.close();
    this.log.info('CryptoModule successfully shutdown');
  }
}
