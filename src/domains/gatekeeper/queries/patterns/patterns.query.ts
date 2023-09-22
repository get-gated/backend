interface IPatternsFilter {
  search?: string;
  test?: string;
  rule?: string[];
}

export class PatternsQuery {
  constructor(
    public readonly limit: number = 50,
    public readonly since?: Date,
    public readonly filter?: IPatternsFilter,
  ) {}
}
