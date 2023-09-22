import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { PaymentSuccessfullyChargedEvent } from '@app/events/payment/payment-successfully-charged.event';
import { EventBusService } from '@app/modules/event-bus';
import { PaymentFailedChargedEvent } from '@app/events/payment/payment-failed-charged.event';
import { LoggerService } from '@app/modules/logger';

import PaymentEntity from '../../entities/payment.entity';
import { PaymentProcessorService } from '../../services/payment-processor/payment-processor.service';

import { ChargeCommand } from './charge.command';

@CommandHandler(ChargeCommand)
export class ChargeHandler implements ICommandHandler<ChargeCommand> {
  constructor(
    private readonly paymentProcessorService: PaymentProcessorService,
    private eventBus: EventBusService,
    @InjectRepository(PaymentEntity)
    private paymentRepository: EntityRepository<PaymentEntity>,
    private log: LoggerService,
  ) {}

  async execute(command: ChargeCommand): Promise<any> {
    const { initiator, initiatorId, provider, amountCents, note } = command;
    const payment = new PaymentEntity({
      provider,
      amountCents,
      initiator,
      initiatorId,
      note,
    });

    try {
      const charge = await this.paymentProcessorService
        .adapt()
        [command.provider].charge(command.amountCents, command.chargeToken, {
          paymentId: payment.paymentId,
          initiatorId: payment.initiatorId,
          initiator: payment.initiator,
        });
      payment.externalId = charge.id;

      try {
        await this.paymentRepository.persistAndFlush(payment);
        await this.eventBus.publish(
          new PaymentSuccessfullyChargedEvent({ ...payment }),
        );
        return payment.paymentId;
      } catch (error) {
        this.log.error({ error }, 'Persisting payment failed');
      }
    } catch (e) {
      await this.eventBus.publish(new PaymentFailedChargedEvent(payment));
      throw e;
    }
  }
}
