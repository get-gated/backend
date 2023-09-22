import { Migration } from '@mikro-orm/migrations';

export class Migration20221219202158 extends Migration {

  async up(): Promise<void> {

    this.addSql('alter table "notification_tx_emails" drop constraint if exists "notification_tx_emails_transaction_check";');
    this.addSql('alter table "notification_tx_emails" alter column "transaction" type text using ("transaction"::text);');
    this.addSql('alter table "notification_tx_emails" add constraint "notification_tx_emails_transaction_check" check ("transaction" in (\'FIRST_DONATION\', \'FIRST_EXPECTED\', \'FIRST_CONNECTION_READY\', \'DONATION_RECEIVED\', \'CONNECTION_STOPPED\', \'CONNECTION_RESUMED\', \'CONNECTION_READY\', \'CONNECTION_REMOVED\', \'RECEIPT_DONATION\', \'RECEIPT_EXPECTED\', \'RECEIPT_EXEMPTION_REQUESTED\', \'ACCOUNT_REMOVED\', \'PENDING_FIRST_CONNECTION\', \'ALLOWED_MESSAGE_TO_USER\', \'ALLOWED_MESSAGE_TO_USER_SAME_DOMAIN\', \'ALLOWED_MESSAGE_TO_USER_GATED_USER\', \'EXPECTED_CONSENT_REQUESTED\'));');

  }

}
