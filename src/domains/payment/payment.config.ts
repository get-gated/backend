import { registerAs } from '@nestjs/config';

type PaymentConfig = {
  stripe: {
    apiKey: string;
  };
  gated: {
    chargeSecret: string;
  };
};

export default registerAs(
  'payment',
  (): PaymentConfig => ({
    stripe: {
      // this isn't defined in dev or tests
      apiKey: process.env.STRIPE_API_KEY ?? '',
    },
    gated: {
      // this isn't defined in dev or tests
      chargeSecret: process.env.CHARGE_SECRET ?? '',
    },
  }),
);
