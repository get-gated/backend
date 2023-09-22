import { ImpressionSource } from '@app/interfaces/challenge/challenge.enums';

export class TrackImpressionCommand {
  constructor(
    public readonly userId: string,
    public readonly nonprofitId: string,
    public readonly source: ImpressionSource,
  ) {}
}
