import { registerAs } from '@nestjs/config';

interface authConfig {
  allowClear: boolean; // don't expect JWT, allow Authorization header to include JSON of AuthUser values
  tenant: string;
  adminDomain: string;
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    serviceAccountCertPath?: string;
  };
  google: {
    clientId: string;
    clientSecret: string;
    allowedClientIds: string[];
  };
  allowedHostRedirectHosts: string[];
}

export default registerAs('auth', (): authConfig => {
  const allowedHostRedirectHosts = process.env.APP_PUBLIC_DOMAIN
    ? [process.env.APP_PUBLIC_DOMAIN]
    : [];
  if (process.env.APP_ALLOWED_REDIRECT_HOSTS) {
    allowedHostRedirectHosts.push(
      ...JSON.parse(process.env.APP_ALLOWED_REDIRECT_HOSTS),
    );
  }

  const allowedClientIds = [process.env.GOOGLE_CLIENT_ID];
  if (process.env.GOOGLE_ALLOWED_CLIENT_IDS) {
    allowedClientIds.push(...JSON.parse(process.env.GOOGLE_ALLOWED_CLIENT_IDS));
  }
  return {
    allowClear: process.env.AUTH_ALLOW_CLEAR === 'true',
    tenant: process.env.AUTH_TENANT ?? '',
    adminDomain: process.env.AUTH_ADMIN_DOMAIN ?? '',
    firebase: {
      apiKey: process.env.AUTH_FIREBASE_API_KEY ?? '',
      authDomain: process.env.AUTH_FIREBASE_AUTH_DOMAIN ?? '',
      projectId: process.env.AUTH_FIREBASE_PROJECT_ID ?? '',
      serviceAccountCertPath: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      allowedClientIds: [],
    },
    allowedHostRedirectHosts,
  };
});
