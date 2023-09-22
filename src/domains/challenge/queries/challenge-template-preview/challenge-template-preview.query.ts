export class ChallengeTemplatePreviewQuery {
  constructor(
    public readonly userId: string,
    public readonly connectionId: string,
    public readonly templateId: string,
    public readonly greetingBlock?: string,
    public readonly leadBlock?: string,
    public readonly donateBlock?: string,
    public readonly expectedBlock?: string,
    public readonly signatureBlock?: string,
  ) {}
}
