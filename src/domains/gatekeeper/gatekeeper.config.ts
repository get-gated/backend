import { registerAs } from '@nestjs/config';

interface GatekeeperConfig {
  invitationSenders: string[];
  defaultAllowedDomains: string[];
}

export default registerAs(
  'gatekeeper',
  (): GatekeeperConfig => ({
    invitationSenders:
      process.env.GATEKEEPER_INVITATION_SENDERS?.split(',') || [],
    defaultAllowedDomains:
      process.env.GATEKEEPER_DEFAULT_ALLOWED_DOMAINS?.split(',') || [],
  }),
);
