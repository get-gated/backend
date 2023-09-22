import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

import StripeAdapter from '../stripe.adapter';

import PaymentConfig from '../../../../payment.config';

import StripeMock from './stripe.mock';

describe('StripeAdapter', () => {
  let adapter: StripeAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(PaymentConfig)],
      providers: [StripeAdapter, { provide: 'STRIPE', useValue: StripeMock }],
    }).compile();

    adapter = module.get<StripeAdapter>(StripeAdapter);
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });
});
