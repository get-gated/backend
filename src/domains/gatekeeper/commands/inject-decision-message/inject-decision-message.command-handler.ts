import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Rule, Verdict } from '@app/interfaces/gatekeeper/gatekeeper.enums';
import { UtilsService } from '@app/modules/utils';
import { LoggerService } from '@app/modules/logger';

import InjectedDecisionMessageEntity from '../../entities/injected-decision-message.entity';
import { ServiceProviderAppService } from '../../../service-provider';
import GatekeeperUserSetting from '../../entities/user-setting.entity';

import { InjectDecisionMessageCommand } from './inject-decision-message.command';

@CommandHandler(InjectDecisionMessageCommand)
export class InjectDecisionMessageCommandHandler
  implements ICommandHandler<InjectDecisionMessageCommand>
{
  constructor(
    private readonly serviceProvider: ServiceProviderAppService,
    private readonly utils: UtilsService,
    @InjectRepository(InjectedDecisionMessageEntity)
    private readonly injectedRepo: EntityRepository<InjectedDecisionMessageEntity>,
    @InjectRepository(GatekeeperUserSetting)
    private readonly settingsRepo: EntityRepository<GatekeeperUserSetting>,
    private log: LoggerService,
  ) {}

  private trainAsGatedLabelName?: string;

  async execute(command: InjectDecisionMessageCommand): Promise<any> {
    if (command.decision.ruling !== Rule.Allow) return;

    const userSettings = await this.settingsRepo.findOne({
      userId: command.message.userId,
    });

    if (!userSettings || userSettings.isInjectDecisionsEnabled === false)
      return;

    if (!this.trainAsGatedLabelName) {
      const labelNames = await this.serviceProvider.configLabelNames();
      this.trainAsGatedLabelName = labelNames.trainAsGated;
    }

    const previous = await this.injectedRepo.findOne({
      threadId: command.message.threadId,
    });

    if (previous) return;

    let reason: string | null = null;
    switch (command.decision.verdict) {
      case Verdict.AddressAllowed:
        reason = `the address ${command.message.from.emailAddress} is Allowed on your Allow List`;
        break;
      case Verdict.DomainAllowed:
        reason = `the domain ${
          this.utils.normalizeEmail(command.message.from.emailAddress).domain
        } is Allowed on your Allow List`;
        break;
      case Verdict.CalendarEventAllowed:
        reason = `the message was related to a calendar event`;
        break;
      case Verdict.PatternAllowed:
        reason = `the senders address matched a pattern that Gated allows by default`;
        break;
      case Verdict.MailingListAddressAllowed:
        reason = `the message was sent to a mailing list/group that is Allowed on your Allow List`;
        break;
      case Verdict.MailingListDomainAllowed:
        reason = `the message was sent to a mailing list/group that has a domain that is Allowed on your Allow List`;
        break;
      case Verdict.UserOptOutAllowed:
        reason = `the address the message was sent to has been opted out of Gated`;
        break;
      default:
        this.log.warn(
          `unhandled verdict for reason ${command.decision.verdict}`,
        );
    }

    const body = `
    <html>
      <body>
        <p>The following message was successfully analyzed by <a href="https://gated.com">Gated</a> and <strong style="color:green">Allowed</strong> in your inbox.</p>
        ${reason ? `<p>This decision was made because ${reason}.</p>` : ''}
        <p>If you do not wish to receive future messages from ${
          command.message.from.emailAddress
        }, simply move this message to the <strong>${
      this.trainAsGatedLabelName
    }</strong>.</p>
        <p>You can fully customize your Allow List from your <a href="https://app.gated.com">dashboard</a> at any time.</p>
      </body>
    </html>
    `;

    const internalDate = new Date(command.message.receivedAt);
    internalDate.setSeconds(internalDate.getSeconds() - 1);

    const messageId = await this.serviceProvider.commandInjectMessage({
      message: {
        body,
        replyToMessageId: command.message.messageId,
        fromName: 'Gated',
        fromEmail: 'support@gated.com',
        connectionId: command.message.connectionId,
        internalDate,
      },
    });

    if (!command.message.threadId) {
      this.log.warn({ command }, `undefined threadId for message decision`);
      return;
    }

    await this.injectedRepo.persistAndFlush(
      new InjectedDecisionMessageEntity({
        userId: command.message.userId,
        threadId: command.message.threadId,
        messageId,
        decisionId: command.decision.decisionId,
        connectionId: command.message.connectionId,
        body,
      }),
    );
  }
}
