export class ToggleChallengeTemplateCommand {
  constructor(
    readonly challengeTemplateId: string,
    readonly isEnabled: boolean,
  ) {}
}
