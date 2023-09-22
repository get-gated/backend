import { Migration } from '@mikro-orm/migrations';

export class Migration20221209000619 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "challenge_nonprofits" add column "art" varchar(1000) null, add column "is_featured" bool not null default false;');
  }

}
