export class UpdateChallengeTemplateCommand {
  constructor(
    readonly challengeTemplateId: string,
    readonly name: string,
    readonly body: string,
    readonly greetingBlock: string,
    readonly leadBlock: string,
    readonly donateBlock: string,
    readonly expectedBlock: string,
    readonly signatureBlock: string,
    readonly isEnabled: boolean,
  ) {}
}
