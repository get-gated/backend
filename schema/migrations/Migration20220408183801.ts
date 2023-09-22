import { Migration } from '@mikro-orm/migrations';

export class Migration20220408183801 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "challenge_nonprofits" add column "url" varchar(255);');
  }

}
