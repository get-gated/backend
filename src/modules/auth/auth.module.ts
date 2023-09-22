import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import AuthConfig from '@app/modules/auth/auth.config';
import { AuthProviderService } from '@app/modules/auth/providers/auth.service';
import { GoogleService } from '@app/modules/auth/providers/adapters/google/google.service';
import { CryptoModule } from '@app/modules/crypto';
import { AuthService } from '@app/modules/auth/auth.service';

import AppConfig from '../../app.config';

import { AuthGuard } from './auth.guard';
import { AuthAdapter } from './identity/auth.adapter';

@Global()
@Module({
  imports: [
    ConfigModule.forFeature(AuthConfig),
    ConfigModule.forFeature(AppConfig),
    CryptoModule,
  ],
  providers: [
    AuthAdapter,
    AuthGuard,
    AuthProviderService,
    GoogleService,
    AuthService,
  ],
  exports: [AuthAdapter, AuthGuard, AuthProviderService],
})
export class AuthModule {}
