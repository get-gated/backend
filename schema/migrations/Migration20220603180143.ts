import { Migration } from '@mikro-orm/migrations';

export class Migration20220603180143 extends Migration {

  async up(): Promise<void> {

    this.addSql('create table "gatekeeper_opt_out_addresses" ("id" uuid not null, "user_id" uuid not null, "email_address" varchar(255) not null, "normalized_email_address" varchar(255) not null, "created_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null);');
    this.addSql('alter table "gatekeeper_opt_out_addresses" add constraint "gatekeeper_opt_out_addresses_pkey" primary key ("id");');
    this.addSql('create index "gatekeeper_opt_out_addresses_user_id_index" on "gatekeeper_opt_out_addresses" ("user_id");');

    this.addSql('alter table "gatekeeper_decisions" add column "enforced_opt_out_address_id" uuid null;');
    this.addSql('alter table "gatekeeper_decisions" drop constraint if exists "gatekeeper_decisions_verdict_check";');
    this.addSql('alter table "gatekeeper_decisions" alter column "verdict" type text using ("verdict"::text);');
    this.addSql('alter table "gatekeeper_decisions" add constraint "gatekeeper_decisions_verdict_check" check ("verdict" in (\'ADDRESS_ALLOWED\', \'ADDRESS_GATED\', \'ADDRESS_MUTED\', \'ADDRESS_ON_THREAD\', \'DOMAIN_ALLOWED\', \'DOMAIN_GATED\', \'DOMAIN_MUTED\', \'PATTERN_ALLOWED\', \'PATTERN_GATED\', \'PATTERN_MUTED\', \'MAILING_LIST_IGNORE\', \'SENDER_UNKNOWN_GATED\', \'CALENDAR_EVENT_ALLOWED\', \'CALENDAR_RSVP_USER_ORGANIZER_ALLOWED\', \'USER_OPT_OUT_ALLOWED\'));');

    this.addSql('drop table if exists "service_provider_aliases" cascade;');
  }

}
