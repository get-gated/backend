import { Provider as AuthProvider } from '@app/modules/auth';
import { Provider } from '@app/interfaces/service-provider/service-provider.enums';

export const mapProviderUtil = (authProvider: AuthProvider): Provider => {
  const map = {
    [AuthProvider.Google]: Provider.Google,
  };

  return map[authProvider];
};
