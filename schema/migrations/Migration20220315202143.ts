import { Migration } from '@mikro-orm/migrations';

export class Migration20220315202143 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "challenge_nonprofits" add column "external_id" varchar(255), add column "ein" varchar(255);');
  }

}
