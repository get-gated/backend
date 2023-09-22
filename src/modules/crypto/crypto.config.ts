import { registerAs } from '@nestjs/config';

interface CryptoConfig {
  enabled: boolean; // when disabled it will make the value opaque, but not encrypted
  kms: {
    keyRingId: string;
    keyId: string;
    projectId: string;
    location: string;
  };
}

export default registerAs(
  'crypto',
  (): CryptoConfig => ({
    enabled: process.env.CRYPTO_ENABLED !== 'false',
    kms: {
      keyRingId: process.env.CRYPTO_KMS_KEY_RING_ID ?? '',
      keyId: process.env.CRYPTO_KMS_KEY_ID ?? '',
      projectId: process.env.CRYPTO_KMS_PROJECT_ID ?? '',
      location: process.env.CRYPTO_KMS_REGION ?? '',
    },
  }),
);
