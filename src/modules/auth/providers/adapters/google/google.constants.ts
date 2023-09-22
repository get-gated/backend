import { GoogleScope } from './google.enums';

export const ServiceProviderConnectionScopes = [
  GoogleScope.GmailModify,
  GoogleScope.UserInfoEmail,
];

export const LoginScopes: GoogleScope[] = [GoogleScope.OpenId];

export const SignupLightScopes: GoogleScope[] = [
  GoogleScope.OpenId,
  GoogleScope.UserInfoProfile,
  GoogleScope.UserInfoEmail,
];

export const SignupScopes: GoogleScope[] = [
  GoogleScope.OpenId,
  GoogleScope.UserInfoEmail,
  ...ServiceProviderConnectionScopes,
];

export const SettingsScopes: GoogleScope[] = [
  ...SignupLightScopes,
  GoogleScope.GmailSettingsBasic,
];
