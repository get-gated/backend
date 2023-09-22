import { Migration } from '@mikro-orm/migrations';

export class Migration20220324162556 extends Migration {

  async up(): Promise<void> {

    this.addSql('alter table "gatekeeper_trainings" drop constraint if exists "gatekeeper_trainings_origin_check";');
    this.addSql('alter table "gatekeeper_trainings" alter column "origin" type text using ("origin"::text);');
    this.addSql('update "gatekeeper_trainings" set "origin" = \'INCLUDED_ON_ALLOWED\' where "origin" = \'CC_ON_ALLOWED\';');
    this.addSql('alter table "gatekeeper_trainings" add constraint "gatekeeper_trainings_origin_check" check ("origin" in (\'ADMIN_APP\', \'SENT_EMAIL\', \'RECEIVED_EMAIL\', \'CALENDAR\', \'PATTERN\', \'USER_INBOX\', \'USER_APP\', \'INITIAL_DEFAULTS\', \'EXPECTED_INTERACTION\', \'INCLUDED_ON_ALLOWED\'));');
  }

}
