import { Migration } from '@mikro-orm/migrations';

export class Migration20230105015200 extends Migration {

  async up(): Promise<void> {

    this.addSql('DELETE FROM donation_requests')

    this.addSql('alter table "donation_requests" rename column "requested_amount" to "amount_in_cents";');
    this.addSql('alter table "donation_requests" drop column "payment_id"');
    this.addSql('alter table "donation_requests" rename column "requested_at" to "created_at";');
    this.addSql('alter table "donation_requests" rename column "donated_at" to "deleted_at";');
    this.addSql('alter table "donation_requests" add column "thank_you_message" text null');
    this.addSql('alter table "donation_requests" add column "name" varchar(255) null');

    this.addSql('alter table "donation_requests" add column "type" text check ("type" in (\'SINGLE_USE\', \'LONG_LIVING\')) not null, add column "cta" varchar(255) null, add column "is_featured" bool null, add column "is_active" bool not null;');
    this.addSql('alter table "donation_requests" drop constraint if exists "donation_requests_nonprofit_id_check";');
    this.addSql('alter table "donation_requests" alter column "nonprofit_id" type uuid using ("nonprofit_id"::uuid);');

    this.addSql('create table "donation_request_interactions" ("id" uuid not null, "request_id" uuid not null, "interaction" text check ("interaction" in (\'VISITED\', \'DONATED\', \'EXEMPTION_REQUESTED\', \'EXEMPTION_GRANTED\', \'EXEMPTION_DENIED\')) not null, "payment_id" uuid null, "amount_in_cents" int4 null, "note" text null, "performed_at" timestamptz(0) not null);');
    this.addSql('alter table "donation_request_interactions" add constraint "donation_request_interactions_pkey" primary key ("id");');
    this.addSql('create index "donation_request_interactions_interaction_index" on "donation_request_interactions" ("interaction");');
    this.addSql('alter table "donation_request_interactions" add constraint "donation_request_interactions_request_id_foreign" foreign key ("request_id") references "donation_requests" ("id") on update cascade;');
  }

}
