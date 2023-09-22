import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { UtilsService } from '@app/modules/utils';
import { PaymentInitiator } from '@app/interfaces/payment/payment.enums';

import PaymentConfig from '../payment.config';

export interface IPaymentTokenPayload {
  initiator: PaymentInitiator;
  initiatorId: string;
}

@Injectable()
export class PaymentService {
  constructor(
    private utils: UtilsService,
    @Inject(PaymentConfig.KEY)
    private config: ConfigType<typeof PaymentConfig>,
  ) {}

  public toPaymentToken(
    initiator: PaymentInitiator,
    initiatorId: string,
  ): string {
    return this.utils.jwtSign(
      {
        initiatorId,
        initiator,
      },
      this.config.gated.chargeSecret,
    );
  }

  public fromPaymentToken(token: string): IPaymentTokenPayload {
    return this.utils.jwtVerify(token, this.config.gated.chargeSecret).data;
  }
}
