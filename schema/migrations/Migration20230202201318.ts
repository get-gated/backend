import { Migration } from '@mikro-orm/migrations';

export class Migration20230202201318 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "challenge_user_settings" alter column "minimum_donation" set not null;');
  }

}
