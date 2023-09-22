/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable default-param-last */
import * as SendGridMail from '@sendgrid/mail';
import { ConfigType } from '@nestjs/config';
import { Transaction } from '@app/interfaces/notification/notification.enums';
import { Inject, Injectable } from '@nestjs/common';
import { LoggerService } from '@app/modules/logger';

import TxEmailEntity from '../../entities/tx-email.entity';
import NotificationConfig from '../../notification.config';

import { TxTemplateVariables } from './tx-email.service';

export const SendGridToken = 'SENDGRID';

interface ISendCustom {
  from: string;
  to: string;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
  suppressionGroupId?: number;
}

abstract class AbstractTxEmailAdapter {
  abstract send(txEmailEntity: TxEmailEntity): Promise<void>;

  abstract sendCustom(props: ISendCustom): Promise<void>;

  abstract hasTemplate(transaction: Transaction): boolean;
}

interface DynamicTemplateVariables {
  user_first_name: string;
  user_last_name: string;
  user_full_name: string;
  user_email_address: string;
  user_avatar?: string;
  user_referral_code?: string | null;
  user_handle?: string;
  nonprofit_name?: string;
  nonprofit_slug?: string;
  donation_amount: string;
  sender_email_address?: string;
  sender_personalized_note?: string;
  connection_provider?: string;
  connection_email?: string;
  reason_text?: string;
  experience_text?: string;
  challenge_expected_consent_id?: string;
  payment_amount?: number;
}

@Injectable()
export class TxEmailAdapter implements AbstractTxEmailAdapter {
  constructor(
    @Inject(SendGridToken) private sgMail: typeof SendGridMail,
    @Inject(NotificationConfig.KEY)
    private notificationConfig: ConfigType<typeof NotificationConfig>,
    private log: LoggerService,
  ) {
    sgMail.setApiKey(this.notificationConfig.sendgrid.apiKey);
  }

  private getTemplateId(transaction: Transaction): string {
    return this.notificationConfig.sendgrid.templates[transaction];
  }

  public hasTemplate(transaction: Transaction): boolean {
    return Boolean(this.getTemplateId(transaction));
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private async sendTemplate(
    templateId: string,
    toAddress: string,
    toName: string,
    dynamicTemplateData: DynamicTemplateVariables,
    sendAt: Date = new Date(),
    bccAddress?: string,
    fromAddress = this.notificationConfig.txEmailFromAddress,
    fromName = this.notificationConfig.txEmailFromName,
    replyToAddress?: string,
    suppressionGroupId?: number,
  ) {
    try {
      const data: SendGridMail.MailDataRequired = {
        from: {
          email: fromAddress,
          name: fromName,
        },
        replyTo: replyToAddress,
        templateId,
        personalizations: [
          {
            to: { email: toAddress, name: toName },
            dynamicTemplateData,
          },
        ],
        sendAt: Math.floor(sendAt.getTime() / 1000),
      };

      if (suppressionGroupId) {
        data.asm = { groupId: suppressionGroupId };
      }
      if (bccAddress && data.personalizations?.length) {
        data.personalizations[0].bcc = { email: bccAddress };
      }
      await this.sgMail.send(data);
    } catch (error) {
      this.log.error({ error }, 'Error sending sendgrid message');
      throw error;
    }
  }

  private formatCurrency(amountInCents: number): string {
    const num = Number(amountInCents) / 100;
    return new Intl.NumberFormat(`en-US`, {
      currency: `USD`,
      style: 'currency',
    }).format(num);
  }

  private mapVariables(
    variables: TxTemplateVariables,
  ): DynamicTemplateVariables {
    return {
      user_first_name: variables.userFirstName,
      user_last_name: variables.userLastName,
      user_full_name: variables.userFullName,
      user_email_address: variables.userEmailAddress,
      user_referral_code: variables.userReferralCode,
      user_avatar: variables.userAvatar,
      user_handle: variables.userHandle,
      nonprofit_name: variables.nonprofitName,
      donation_amount: this.formatCurrency(variables.paymentAmount ?? 0),
      sender_email_address: variables.senderEmailAddress,
      connection_provider: variables.connectionProvider,
      connection_email: variables.connectionEmail,
      reason_text: variables.reasonText,
      experience_text: variables.experienceText,
      sender_personalized_note: variables.senderPersonalizedNote,
      challenge_expected_consent_id: variables.challengeExpectedConsentId,
      nonprofit_slug: variables.nonprofitSlug,
      payment_amount: variables.paymentAmount,
    };
  }

  public async sendCustom({
    from,
    to,
    subject,
    html,
    text,
    replyTo,
  }: ISendCustom): Promise<any> {
    await this.sgMail.send({
      from,
      to,
      subject,
      html,
      // type spec says this is required, but it's fine given undfined but will fail if you give it an empty string
      text: text as string,
      replyTo,
    });
  }

  public async send(
    txEmailEntity: TxEmailEntity,
    fromName?: string,
    fromAddress?: string,
    replyToAddress?: string,
    suppressionGroupId?: number,
  ): Promise<any> {
    this.log.info({ ...txEmailEntity }, 'Sending tx email');
    let bccAddress;
    if (
      !this.notificationConfig.txEmailNoBcc.includes(txEmailEntity.transaction)
    ) {
      bccAddress = this.notificationConfig.txEmailBccAddress;
    }
    const templateId = this.getTemplateId(txEmailEntity.transaction);
    const dynamicTemplateData = this.mapVariables(txEmailEntity.variables);
    return this.sendTemplate(
      templateId,
      txEmailEntity.toAddress,
      txEmailEntity.toName,
      dynamicTemplateData,
      new Date(),
      bccAddress,
      fromAddress,
      fromName,
      replyToAddress,
      suppressionGroupId,
    );
  }
}
