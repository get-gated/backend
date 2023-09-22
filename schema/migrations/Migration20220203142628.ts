import { Migration } from '@mikro-orm/migrations';

export class Migration20220203142628 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "challenge_user_settings" drop constraint if exists "challenge_user_settings_minimum_donation_check";');
    this.addSql('alter table "challenge_user_settings" drop column "minimum_donation"');
    this.addSql('alter table "challenge_user_settings" add column "minimum_donation" int4 default 200;');
    this.addSql('alter table "challenge_user_settings" alter column "minimum_donation" drop default;');
  }

}
