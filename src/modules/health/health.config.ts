import { registerAs } from '@nestjs/config';
import { ConfigurationInput } from 'lightship';

interface HealthConfig {
  lightship: ConfigurationInput;
}

export default registerAs(
  'health',
  (): HealthConfig => ({
    lightship: {
      port: Number(process.env.LIGHTSHIP_PORT),
      detectKubernetes: process.env.LIGHTSHIP_DETECT_K8S !== 'false',
    },
  }),
);
