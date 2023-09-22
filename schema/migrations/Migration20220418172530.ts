import { Migration } from '@mikro-orm/migrations';

export class Migration20220418172530 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "gatekeeper_decisions" drop constraint if exists "gatekeeper_decisions_verdict_check";');
    this.addSql('alter table "gatekeeper_decisions" alter column "verdict" type text using ("verdict"::text);');
    this.addSql('alter table "gatekeeper_decisions" add constraint "gatekeeper_decisions_verdict_check" check ("verdict" in (\'ADDRESS_ALLOWED\', \'ADDRESS_GATED\', \'ADDRESS_MUTED\', \'ADDRESS_ON_THREAD\', \'DOMAIN_ALLOWED\', \'DOMAIN_GATED\', \'DOMAIN_MUTED\', \'PATTERN_ALLOWED\', \'PATTERN_GATED\', \'PATTERN_MUTED\', \'MAILING_LIST_IGNORE\', \'SENDER_UNKNOWN_GATED\', \'CALENDAR_EVENT_ALLOWED\', \'CALENDAR_RSVP_USER_ORGANIZER_ALLOWED\'));');
    this.addSql('alter table "gatekeeper_decisions" drop constraint if exists "gatekeeper_decisions_overruling_made_check";');
    this.addSql('alter table "gatekeeper_decisions" alter column "overruling_made" type text using ("overruling_made"::text);');
    this.addSql('alter table "gatekeeper_decisions" add constraint "gatekeeper_decisions_overruling_made_check" check ("overruling_made" in (\'USER_ON_BCC_MUTE\', \'CALENDER_EVENT_MUTE\'));');
  }

}
