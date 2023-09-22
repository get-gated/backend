import { Injectable } from '@nestjs/common';
import { Provider } from '@app/modules/auth';

import { GoogleService } from './adapters/google/google.service';
import { AuthAdapterInterface } from './auth.adapter.interface';

type Adapters = {
  [one in Provider]: AuthAdapterInterface;
};

@Injectable()
export class AuthProviderService {
  public readonly adapters: Adapters;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  constructor(private google: GoogleService) {
    this.adapters = Object.freeze({
      [Provider.Google]: google,
    });
  }
}
