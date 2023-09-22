import { Migration } from '@mikro-orm/migrations';

export class Migration20220114163822 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "challenge_interactions" drop constraint if exists "challenge_interactions_payment_id_check";');
    this.addSql('alter table "challenge_interactions" alter column "payment_id" type uuid using ("payment_id"::uuid);');
    this.addSql('alter table "challenge_interactions" alter column "payment_id" drop not null;');
    this.addSql('alter table "challenge_interactions" drop constraint if exists "challenge_interactions_user_reply_message_id_check";');
    this.addSql('alter table "challenge_interactions" alter column "user_reply_message_id" type varchar(255) using ("user_reply_message_id"::varchar(255));');
    this.addSql('alter table "challenge_interactions" alter column "user_reply_message_id" drop not null;');
    this.addSql('alter table "challenge_interactions" drop column "donation_amount";');

    this.addSql('alter table "payment" drop constraint if exists "payment_provider_check";');
    this.addSql('alter table "payment" alter column "provider" type text using ("provider"::text);');
    this.addSql('alter table "payment" add constraint "payment_provider_check" check ("provider" in (\'Stripe\'));');

    this.addSql('alter table "service_provider_connections" drop constraint if exists "service_provider_connections_provider_check";');
    this.addSql('alter table "service_provider_connections" alter column "provider" type text using ("provider"::text);');
    this.addSql('alter table "service_provider_connections" add constraint "service_provider_connections_provider_check" check ("provider" in (\'GOOGLE\'));');

    this.addSql('alter table "service_provider_thread_moves" drop constraint if exists "service_provider_thread_moves_destination_check";');
    this.addSql('alter table "service_provider_thread_moves" alter column "destination" type text using ("destination"::text);');
    this.addSql('alter table "service_provider_thread_moves" add constraint "service_provider_thread_moves_destination_check" check ("destination" in (\'inbox\', \'all\', \'trash\', \'archive\', \'drafts\', \'sent\', \'spam\', \'important\', \'Gated\', \'Expected\', \'Donation\'));');

    this.addSql('alter table "service_provider_connection_syncs" drop constraint if exists "service_provider_connection_syncs_type_check";');
    this.addSql('alter table "service_provider_connection_syncs" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "service_provider_connection_syncs" add constraint "service_provider_connection_syncs_type_check" check ("type" in (\'SENT\'));');
  }

}
