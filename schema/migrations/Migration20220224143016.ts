import { Migration } from '@mikro-orm/migrations';

export class Migration20220224143016 extends Migration {

  async up(): Promise<void> {

    this.addSql('alter table "payment" add column "initiator" text check ("initiator" in (\'ChallengeInteraction\')) not null default \'ChallengeInteraction\', add column "initiator_id" varchar(255) not null default \'unknown\', add column "created_at" timestamptz(0) not null default NOW();');
    this.addSql('alter table "payment" drop constraint if exists "payment_provider_check";');
    this.addSql('alter table "payment" alter column "provider" type text using ("provider"::text);');
    this.addSql('alter table "payment" add constraint "payment_provider_check" check ("provider" in (\'Stripe\'));');
  }

}
