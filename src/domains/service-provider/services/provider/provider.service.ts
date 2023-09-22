import { Provider } from '@app/interfaces/service-provider/service-provider.enums';
import { Injectable } from '@nestjs/common';

import { GoogleService } from './adapters/google/google.service';
import { ProviderAdapterInterface } from './adapters/provider.adapter.interface';

type Adapters = {
  [one in Provider]: ProviderAdapterInterface;
};

@Injectable()
export class ProviderService {
  public readonly adapters: Adapters;

  constructor(google: GoogleService) {
    this.adapters = Object.freeze({
      [Provider.Google]: google,
    });
  }
}
