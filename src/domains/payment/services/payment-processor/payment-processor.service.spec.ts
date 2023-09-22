import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { PaymentProcessorService } from './payment-processor.service';

import StripeAdapter from './adapters/stripe.adapter';

import PaymentConfig from '../../payment.config';

import StripeMock from './adapters/test/stripe.mock';
import { LoggerService } from '@app/modules/logger';

describe('PaymentProcessorService', () => {
  let service: PaymentProcessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(PaymentConfig)],
      providers: [
        PaymentProcessorService,
        { provide: LoggerService, useValue: console },
        StripeAdapter,
        { provide: 'STRIPE', useValue: StripeMock },
      ],
    }).compile();

    service = module.get<PaymentProcessorService>(PaymentProcessorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should provide Stripe adapter', () => {
    expect(service.adapt().Stripe).toBeDefined();
  });
});
