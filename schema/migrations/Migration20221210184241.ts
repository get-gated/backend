import { Migration } from '@mikro-orm/migrations';

export class Migration20221210184241 extends Migration {

  async up(): Promise<void> {

    this.addSql('alter table "users" add column "handle" varchar(255) null;');
    this.addSql('create index "users_handle_index" on "users" ("handle");');

    this.addSql('create table "challenge_visitor_interactions" ("id" uuid not null, "user_id" uuid not null, "nonprofit_id" uuid not null, "payment_id" uuid null, "email" varchar(255) not null, "message" text not null, "payment_amount" int4 null, "user_reply_message_id" varchar(255) null, "created_at" timestamptz(0) not null);');
    this.addSql('alter table "challenge_visitor_interactions" add constraint "challenge_visitor_interactions_pkey" primary key ("id");');
    this.addSql('alter table "challenge_visitor_interactions" add constraint "challenge_visitor_interactions_nonprofit_id_foreign" foreign key ("nonprofit_id") references "challenge_nonprofits" ("id") on update cascade;');

    this.addSql('alter table "payment" drop constraint if exists "payment_initiator_check";');
    this.addSql('alter table "payment" alter column "initiator" type text using ("initiator"::text);');
    this.addSql('alter table "payment" add constraint "payment_initiator_check" check ("initiator" in (\'ChallengeInteraction\', \'VisitorInteraction\'));');
    this.addSql('alter table "payment" alter column "initiator" drop default;');
  }

}
