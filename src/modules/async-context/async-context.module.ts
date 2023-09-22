import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AsyncContextModule as ASM } from '@nestjs-steroids/async-context';
import { AsyncContextService } from '@app/modules/async-context/async-context.service';
import { AsyncContextInterceptor } from '@app/modules/async-context/async-context.interceptor';

@Global()
@Module({
  imports: [ASM.forRoot()],
  providers: [
    AsyncContextService,
    { provide: APP_INTERCEPTOR, useClass: AsyncContextInterceptor },
  ],
  exports: [AsyncContextService],
})
export class AsyncContextModule {}
