import { Migration } from '@mikro-orm/migrations';

export class Migration20221230220605 extends Migration {

  async up(): Promise<void> {

    this.addSql('create table "donation_requests" ("id" uuid not null, "user_id" uuid not null, "nonprofit_id" uuid not null, "requested_amount" int4 not null, "memo" varchar(255) null, "requested_at" timestamptz(0) not null, "payment_id" uuid null, "donated_at" timestamptz(0) null);');
    this.addSql('alter table "donation_requests" add constraint "donation_requests_pkey" primary key ("id");');
    this.addSql('create index "donation_requests_user_id_index" on "donation_requests" ("user_id");');


    this.addSql('alter table "payment" drop constraint if exists "payment_initiator_check";');
    this.addSql('alter table "payment" alter column "initiator" type text using ("initiator"::text);');
    this.addSql('alter table "payment" add constraint "payment_initiator_check" check ("initiator" in (\'ChallengeInteraction\', \'VisitorInteraction\', \'UserDonationRequest\'));');
  }

}
