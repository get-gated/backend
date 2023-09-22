import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaymentQuery } from './payment.query';
import { InjectRepository } from '@mikro-orm/nestjs';
import PaymentEntity from '../../entities/payment.entity';
import { EntityRepository } from '@mikro-orm/postgresql';

@QueryHandler(PaymentQuery)
export class PaymentQueryHandler implements IQueryHandler<PaymentQuery> {
  constructor(
    @InjectRepository(PaymentEntity)
    private paymentRepo: EntityRepository<PaymentEntity>,
  ) {}
  async execute(query: PaymentQuery): Promise<PaymentEntity[]> {
    return this.paymentRepo.find({ paymentId: { $in: query.paymentIds } });
  }
}
