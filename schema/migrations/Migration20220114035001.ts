import { Migration } from '@mikro-orm/migrations';

export class Migration20220114035001 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "notification_tx_emails" drop constraint if exists "notification_tx_emails_transaction_check";');
    this.addSql('alter table "notification_tx_emails" alter column "transaction" type text using ("transaction"::text);');
    this.addSql('alter table "notification_tx_emails" add constraint "notification_tx_emails_transaction_check" check ("transaction" in (\'FIRST_DONATION\', \'FIRST_EXPECTED\', \'FIRST_CONNECTION_READY\', \'FIRST_DONATION\', \'CONNECTION_STOPPED\', \'CONNECTION_RESUMED\', \'CONNECTION_READY\', \'USER_JOINED\', \'RECEIPT_DONATION\', \'RECEIPT_DONATION\', \'RECEIPT_REPLY\'));');

    this.addSql('alter table "payment" drop constraint if exists "payment_provider_check";');
    this.addSql('alter table "payment" alter column "provider" type text using ("provider"::text);');
    this.addSql('alter table "payment" add constraint "payment_provider_check" check ("provider" in (\'Stripe\'));');

    this.addSql('alter table "service_provider_connections" drop constraint if exists "service_provider_connections_provider_check";');
    this.addSql('alter table "service_provider_connections" alter column "provider" type text using ("provider"::text);');
    this.addSql('alter table "service_provider_connections" add constraint "service_provider_connections_provider_check" check ("provider" in (\'GOOGLE\'));');

    this.addSql('alter table "service_provider_connection_syncs" drop constraint if exists "service_provider_connection_syncs_type_check";');
    this.addSql('alter table "service_provider_connection_syncs" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "service_provider_connection_syncs" add constraint "service_provider_connection_syncs_type_check" check ("type" in (\'SENT\'));');
  }

}
