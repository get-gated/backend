import { Migration } from '@mikro-orm/migrations';

export class Migration20221213205401 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "challenge_interactions" add column "expected_consent_id" varchar(255) null;');
  }

}
