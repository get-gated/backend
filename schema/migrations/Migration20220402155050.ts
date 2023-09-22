import { Migration } from '@mikro-orm/migrations';

export class Migration20220402155050 extends Migration {

  async up(): Promise<void> {

    this.addSql('alter table "users" add column "legacy_user_id" varchar(255) null;');

    this.addSql('alter table "gatekeeper_trainings" drop constraint if exists "gatekeeper_trainings_origin_check";');
    this.addSql('alter table "gatekeeper_trainings" alter column "origin" type text using ("origin"::text);');
    this.addSql('alter table "gatekeeper_trainings" add constraint "gatekeeper_trainings_origin_check" check ("origin" in (\'ADMIN_APP\', \'SENT_EMAIL\', \'RECEIVED_EMAIL\', \'CALENDAR\', \'PATTERN\', \'USER_INBOX\', \'USER_APP\', \'INITIAL_DEFAULTS\', \'EXPECTED_INTERACTION\', \'INCLUDED_ON_ALLOWED\', \'MIGRATION\'));');

    this.addSql('alter table "service_provider_connections" add column "legacy_connection_id" varchar(255) null;');

  }

}
