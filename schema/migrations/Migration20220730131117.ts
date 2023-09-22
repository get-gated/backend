import { Migration } from '@mikro-orm/migrations';

export class Migration20220730131117 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "challenge_user_settings" add column "inject_responses" bool not null default false;');

    this.addSql('alter table "challenges" add column "inject_responses" bool not null default false;');
  }

}
