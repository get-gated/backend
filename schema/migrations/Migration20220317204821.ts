import { Migration } from '@mikro-orm/migrations';

export class Migration20220317204821 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "challenges" add column "to_normalized" varchar(255);');
    this.addSql(`update "challenges" set "to_normalized"=LOWER("to") where to_normalized is null`);
    this.addSql('alter table "challenges" alter column "to_normalized" set not null;');
  }

}
