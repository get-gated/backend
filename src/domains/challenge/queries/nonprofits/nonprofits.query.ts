export class NonprofitsQuery {
  constructor(
    public readonly isDisplay: boolean,
    public readonly categoryId?: string,
    public readonly search?: string,
    public readonly isFeatured?: boolean,
  ) {}
}
