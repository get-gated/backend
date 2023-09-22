import { Migration } from '@mikro-orm/migrations';

export class Migration20221202210019 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "challenge_user_settings" add column "nonprofit_reason" text null;');
    this.addSql('alter table "challenge_interactions" add column "personalized_note" text null;');
    this.addSql('alter table "payment" add column "note" text null;');
    this.addSql('alter table "challenge_interactions" add column "expected_reason" text check ("expected_reason" in (\'KNOW_PERSONALLY\', \'REQUESTED_MESSAGE\', \'NON_EMAIL_FOLLOW_UP\', \'OTHER\')) null, add column "expected_reason_description" text null;');
  }

}
