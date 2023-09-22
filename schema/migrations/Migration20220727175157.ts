import { Migration } from '@mikro-orm/migrations';

export class Migration20220727175157 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "challenges" drop constraint if exists "challenges_withhold_reason_check";');
    this.addSql('alter table "challenges" alter column "withhold_reason" type text using ("withhold_reason"::text);');
    this.addSql('alter table "challenges" add constraint "challenges_withhold_reason_check" check ("withhold_reason" in (\'RECENT_CHALLENGE\', \'USER_DISABLE_SETTING\', \'CALENDAR_EVENT\'));');
  }

}
