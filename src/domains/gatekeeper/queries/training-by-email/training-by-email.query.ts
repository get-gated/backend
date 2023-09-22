export interface ITrainingByEmailQuery {
  username?: string | null;
  domain: string;
  userId: string;
}

export class TrainingByEmailQuery {
  constructor(public readonly emails: ITrainingByEmailQuery[]) {}
}
