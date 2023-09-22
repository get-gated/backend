import { Migration } from '@mikro-orm/migrations';

export class Migration20220731213732 extends Migration {

  async up(): Promise<void> {

    this.addSql('alter table "gatekeeper_decisions" drop constraint if exists "gatekeeper_decisions_verdict_check";');
    this.addSql('alter table "gatekeeper_decisions" alter column "verdict" type text using ("verdict"::text);');
    this.addSql('alter table "gatekeeper_decisions" add constraint "gatekeeper_decisions_verdict_check" check ("verdict" in (\'ADDRESS_ALLOWED\', \'ADDRESS_GATED\', \'ADDRESS_MUTED\', \'ADDRESS_ON_THREAD\', \'DOMAIN_ALLOWED\', \'DOMAIN_GATED\', \'DOMAIN_MUTED\', \'PATTERN_ALLOWED\', \'PATTERN_GATED\', \'PATTERN_MUTED\', \'MAILING_LIST_IGNORE\', \'MAILING_LIST_ADDRESS_ALLOWED\', \'MAILING_LIST_ADDRESS_GATED\', \'MAILING_LIST_ADDRESS_MUTED\', \'MAILING_LIST_DOMAIN_ALLOWED\', \'MAILING_LIST_DOMAIN_GATED\', \'MAILING_LIST_DOMAIN_MUTED\', \'SENDER_UNKNOWN_GATED\', \'CALENDAR_EVENT_ALLOWED\', \'CALENDAR_RSVP_USER_ORGANIZER_ALLOWED\', \'USER_OPT_OUT_ALLOWED\'));');

    this.addSql('alter table "service_provider_threads" add column "created_at" timestamptz(0) null;');
    this.addSql('alter table "service_provider_threads" drop column "labels";');
    this.addSql('alter table "service_provider_threads" drop column "is_starred";');
    this.addSql('alter table "service_provider_threads" drop column "is_unread";');
    this.addSql('alter table "service_provider_threads" drop column "participants";');
    this.addSql('alter table "service_provider_threads" drop column "last_message_at";');
    this.addSql('alter table "service_provider_threads" drop column "last_sent_at";');
    this.addSql('alter table "service_provider_threads" drop column "is_anonymized";');

    this.addSql('alter table "service_provider_messages" add column "created_at" timestamptz(0) null;');
    this.addSql('alter table "service_provider_messages" drop column "labels";');
    this.addSql('alter table "service_provider_messages" drop column "is_starred";');
    this.addSql('alter table "service_provider_messages" drop column "is_unread";');
  }

}
