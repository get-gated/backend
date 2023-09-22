import { Migration } from '@mikro-orm/migrations';

export class Migration20220301214309 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "challenge_nonprofits" add column "is_displayed" bool not null default false;');
  }

}
