import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DataloaderService } from './dataloader.service';

@Module({
  imports: [CqrsModule],
  providers: [DataloaderService],
  exports: [DataloaderService],
})
export class DataloaderModule {}
