export class VolumeStatsQuery {
  constructor(
    public readonly userId: string,
    public readonly startAt: Date,
    public readonly endAt: Date,
  ) {}
}
