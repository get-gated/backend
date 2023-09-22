import NonprofitEntity from '../../entities/nonprofit.entity';

export class UserProfileResponseDto {
  readonly featured!: {
    readonly donationRequestId: string;
    readonly cta: string;
  }[];

  readonly nonprofit!: Pick<
    NonprofitEntity,
    'name' | 'description' | 'nonprofitId'
  >;

  nonprofitReason!: string;
}
