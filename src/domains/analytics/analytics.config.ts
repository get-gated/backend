import { registerAs } from '@nestjs/config';

interface appConfig {
  segment: {
    writeKey: string;
  };
}

export default registerAs(
  'analytics',
  (): appConfig => ({
    segment: {
      writeKey: process.env.ANALYTICS_SEGMENT_WRITE_KEY ?? 'N/A',
    },
  }),
);
